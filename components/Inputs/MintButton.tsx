import clsx from 'clsx';
import { BigNumber, BigNumberish, Contract } from 'ethers';
import { useEffect, useState, useCallback } from 'react';
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
            let unsignedTx;
            let gasLimit: BigNumberish;
            let params = [];
            let fnName = '';

            if (selectedPixelsList.length > 1) {
                fnName = 'changePixelsColor';
                params = [
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
                ];
            } else {
                fnName = 'changePixelColor';
                params = [
                    selectedCoordinates.x,
                    selectedCoordinates.y,
                    {
                        R: BigNumber.from(selectedColor.r),
                        G: BigNumber.from(selectedColor.g),
                        B: BigNumber.from(selectedColor.b),
                    },
                ];
            }

            unsignedTx = await mergeCanvasContract.populateTransaction[fnName](
                ...params
            );
            try {
                gasLimit = await mergeCanvasContract.estimateGas[fnName](
                    ...params
                );
            } catch {
                gasLimit = BigNumber.from(300000).mul(
                    selectedPixelsList.length
                );
            }

            console.log('Gas limit', gasLimit.toString());
            const txChangeColor = await signer.sendTransaction({
                ...unsignedTx,
                value: getTotalPrice(selectedPixelsList).toString(),
                ...(IS_PRODUCTION ? {} : { gasLimit }),
            });

            setWaitingForTxConfirmation(true);
            console.log(txChangeColor);
            try {
                const receipt = await txChangeColor.wait();
                console.log({ receipt });
            } catch (error) {
                console.log({ error });
            }
            setWaitingForTxConfirmation(false);
        } catch (error) {
            console.error(error);
        } finally {
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
        getTotalPrice,
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
