import clsx from 'clsx';
import { providers, BigNumber, BigNumberish, Contract } from 'ethers';
import { useEffect, useState, useCallback } from 'react';
import {toast, ToastOptions} from 'react-toastify';
import { useNetwork, useSwitchNetwork, useSigner, useContract } from 'wagmi';

import {
    IS_PRODUCTION,
    MERGE_CANVAS_CONTRACT_ADDRESS,
} from '../../utils/constants';
import MergeCanvasArtifact from '../../contracts/MergeCanvas.json';
import { usePixelCanvasContext } from '../../contexts/PixelCanvasContext';
import { PixelInfoSection } from '../Displays/PixelInfo';
import { formatPrice } from '../../utils/misc';
import { SelectedPixelsList } from '../../utils/types';

function getTotalPrice(selectedPixelsList: SelectedPixelsList): BigNumber {
    return selectedPixelsList.reduce(
        (a, b) => a.add(b.price),
        BigNumber.from('0')
    );
}

const MAX_PIXEL_CHANGE_PER_TX = 250;

const toastConfig: ToastOptions = {
    position: 'top-right',
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
}

type MintParamsForSinglePixel = [number, number, { R: BigNumber; B: BigNumber; G: BigNumber }]
type MintParamsForMultiplePixels = [number[], number[], { R: BigNumber; B: BigNumber; G: BigNumber }[], BigNumber[]]

function createMintParamsForMultiplePixels(selectedPixelsList: SelectedPixelsList): MintParamsForMultiplePixels {
    return [
        selectedPixelsList.map((item) => item.coordinates.x),
        selectedPixelsList.map((item) => item.coordinates.y),
        selectedPixelsList.map((item) => {
            return {
                R: BigNumber.from(item.color.r),
                G: BigNumber.from(item.color.g),
                B: BigNumber.from(item.color.b),
            };
        }),
        selectedPixelsList.map((item) => item.price),
    ]
}

function getMintParamsForMultiplePixels(selectedPixelsList: SelectedPixelsList): {
    params: MintParamsForMultiplePixels[],
    isMultipleTxs: boolean,
} {
    let params = []
    let isMultipleTxs = false;
    if (selectedPixelsList.length > MAX_PIXEL_CHANGE_PER_TX) {
        isMultipleTxs = true;
        for (let i = 0; i < selectedPixelsList.length; i += MAX_PIXEL_CHANGE_PER_TX) {
            params.push(createMintParamsForMultiplePixels(selectedPixelsList.slice(i, i + MAX_PIXEL_CHANGE_PER_TX)));
        }
    } else {
        params.push(createMintParamsForMultiplePixels(selectedPixelsList))
    }
    return {params, isMultipleTxs}
}

export const MintButton = () => {
    const {
        selectedColor,
        selectedCoordinates,
        selectedPixelsList,
        setWaitingForTxConfirmation,
    } = usePixelCanvasContext();

    const {
        data: signer,
        // isError: isErrorSigner,
        isLoading: isLoadingSigner,
    } = useSigner();

    const { chain } = useNetwork();
    const { switchNetworkAsync } = useSwitchNetwork();

    const [isOwnButtonDisabled, setIsOwnButtonDisabled] = useState<boolean>();
    const [totalPrice, setTotalPrice] = useState<BigNumber>(
        BigNumber.from('0')
    );

    const mergeCanvasContract = useContract({
        addressOrName: MERGE_CANVAS_CONTRACT_ADDRESS,
        contractInterface: MergeCanvasArtifact.abi,
        signerOrProvider: signer,
    }) as Contract;

    const ownPixels = useCallback(async () => {
        try {
            if (
                !signer ||
                !mergeCanvasContract ||
                !chain ||
                !switchNetworkAsync
            )
                return;

            if (!selectedPixelsList.length) return;

            setIsOwnButtonDisabled(true);
            // if (chain.id !== 5) await switchNetworkAsync(5);
            let gasLimit: BigNumberish | undefined;
            let params: (MintParamsForSinglePixel | MintParamsForMultiplePixels)[] = [];
            let fnName = '';
            let isMultipleTxs = false;
            let txsChangeColor: Promise<providers.TransactionResponse>[] = []

            if (selectedPixelsList.length > 1) {
                fnName = 'changePixelsColor';
                const mintParams = getMintParamsForMultiplePixels(selectedPixelsList)
                isMultipleTxs = mintParams.isMultipleTxs;
                params = mintParams.params;
            } else {
                fnName = 'changePixelColor';
                params.push([
                    selectedCoordinates.x,
                    selectedCoordinates.y,
                    {
                        R: BigNumber.from(selectedColor.r),
                        G: BigNumber.from(selectedColor.g),
                        B: BigNumber.from(selectedColor.b),
                    },
                ])
            }

            if (!IS_PRODUCTION) {
                gasLimit = await mergeCanvasContract.estimateGas[fnName](...params)
                    .then((limit) => limit)
                    .catch((error) => BigNumber.from(300000).mul(
                        selectedPixelsList.length
                    ))
                gasLimit = BigNumber.from(Math.floor(gasLimit.toNumber() * 1.5)),
                console.log('Gas limit', gasLimit.toString());
            } else {
                gasLimit = undefined
            }

            if (!isMultipleTxs) {
                const unsignedTx = await mergeCanvasContract.populateTransaction[fnName](
                    ...params[0]
                );

                txsChangeColor.push(
                    signer.sendTransaction({
                        ...unsignedTx,
                        value: getTotalPrice(selectedPixelsList).toString(),
                        gasLimit,
                    })
                );
            } else {
                toast('🦄 Your pixels will be colored in multiple transactions due to block gas limit!', toastConfig);

                params.forEach((param) => {
                    mergeCanvasContract.populateTransaction[fnName](
                        ...params[0]
                    ).then((unsignedTx) => {
                        txsChangeColor.push(
                            signer.sendTransaction({
                                ...unsignedTx,
                                value: getTotalPrice(selectedPixelsList).toString(),
                                gasLimit,
                            })
                        )
                    })
                })
            }

            setWaitingForTxConfirmation(true);
            console.log(txsChangeColor);
            await Promise.allSettled(txsChangeColor)
                .catch((err) => { throw err })
        } catch (error) {
            console.error(error);
        } finally {
            setWaitingForTxConfirmation(false);
            setIsOwnButtonDisabled(false);
        }
    }, [
        signer,
        mergeCanvasContract,
        chain,
        switchNetworkAsync,
        selectedPixelsList,
        setWaitingForTxConfirmation,
        selectedCoordinates,
        selectedColor,
    ]);

    useEffect(() => {
        setTotalPrice(getTotalPrice(selectedPixelsList));
        setIsOwnButtonDisabled(selectedPixelsList.length === 0);
    }, [selectedPixelsList]);

    return (
        <div className="flex-none">
            {isLoadingSigner ? (
                <div>Connect Wallet!</div>
            ) : (
                <PixelInfoSection name="Get pixels">
                    <div className="flex flex-col space-y-2">
                        <div>
                            <p className="text-center">
                                {`Total Price: ${formatPrice(
                                    totalPrice.toString()
                                )}`}
                            </p>
                        </div>
                        <button
                            type="button"
                            className={clsx(
                                'py-3 px-6 w-full bg-eth-gold/80 text-white font-bold rounded uppercase shadow transition cursor-pointer',
                                'hover:bg-eth-gold hover:shadow-lg',
                                isOwnButtonDisabled &&
                                    'bg-eth-gray opacity-40 cursor-none'
                            )}
                            onClick={() => ownPixels()}
                        >
                            Own Pixels
                        </button>
                    </div>
                </PixelInfoSection>
            )}
        </div>
    );
};
