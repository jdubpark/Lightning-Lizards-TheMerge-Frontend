import clsx from 'clsx';
import {
    utils,
    BigNumber as ethBigNumber,
    Contract,
    ethers,
    BigNumber,
} from 'ethers';
import { useState, useCallback } from 'react';
import {
    useNetwork,
    useSwitchNetwork,
    useSigner,
    chain,
    useContract,
} from 'wagmi';
import { MERGE_CANVAS_CONTRACT_ADDRESS } from '../../utils/constants';
import MergeCanvasArtifact from '../../contracts/MergeCanvas.json';
import { usePixelCanvasContext } from '../../contexts/PixelCanvasContext';
import { PixelInfoSection } from '../Displays/PixelInfo';
import { formatPrice } from '../../utils/misc';

export const MintButton = () => {
    const {
        selectedColor,
        selectedCoordinates,
        selectedPixelsList,
        setWaitingForTxConfirmation,
    } = usePixelCanvasContext();

    const {
        data: signer,
        isError: isErrorSigner,
        isLoading: isLoadingSigner,
    } = useSigner();

    const { chain } = useNetwork();
    const {
        chains,
        error: errorSwitchChain,
        isLoading: isLoadingSwitchChain,
        pendingChainId,
        switchNetworkAsync,
    } = useSwitchNetwork();

    const [mintCallData, setMintCallData] = useState<string>();

    const mergeCanvasContract = useContract({
        addressOrName: MERGE_CANVAS_CONTRACT_ADDRESS,
        contractInterface: MergeCanvasArtifact.abi,
        signerOrProvider: signer,
    }) as Contract;

    const getTotalPrice = (): BigNumber => {
        let totalPrice = ethers.utils.parseEther('0');

        selectedPixelsList.forEach(
            ({ price }) => (totalPrice = totalPrice.add(price))
        );

        return totalPrice;
    };

    const ownPixels = useCallback(async () => {
        try {
            if (
                !signer ||
                !mergeCanvasContract ||
                !chain ||
                !switchNetworkAsync
            )
                return;

            if (!selectedPixelsList.length) return

            // if (chain.id !== 5) await switchNetworkAsync(5);
            let unsignedTx;
            if (selectedPixelsList.length > 1) {
                unsignedTx =
                    await mergeCanvasContract.populateTransaction.changePixelsColor(
                        selectedPixelsList.map((item) => item.coordinates.x),
                        selectedPixelsList.map((item) => item.coordinates.y),
                        selectedPixelsList.map((item) => {
                            return {
                                R: ethBigNumber.from(item.color.r),
                                G: ethBigNumber.from(item.color.g),
                                B: ethBigNumber.from(item.color.b),
                            };
                        }),
                        selectedPixelsList.map((item) => item.price)
                    );
            } else {
                unsignedTx =
                    await mergeCanvasContract.populateTransaction.changePixelColor(
                        selectedCoordinates.x,
                        selectedCoordinates.y,
                        {
                            R: ethBigNumber.from(selectedColor.r),
                            G: ethBigNumber.from(selectedColor.g),
                            B: ethBigNumber.from(selectedColor.b),
                        }
                    );
            }

            const txChangeColor = await signer.sendTransaction({
                ...unsignedTx,
                value: getTotalPrice().toString(),
            });

            setWaitingForTxConfirmation(true);
            console.log(txChangeColor);
            await txChangeColor.wait();
            setWaitingForTxConfirmation(false);
        } catch (error) {
            console.log(error);
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

    return (
        <div className="flex-none">
            {isLoadingSigner ? (
                <div>Connect Wallet!</div>
            ) : (
                <PixelInfoSection name="Get pixels">
                    <div className="flex flex-col space-y-2">
                        <div>
                            <p className="text-center">
                                Total Price:{' '}
                                {formatPrice(getTotalPrice().toString())}
                            </p>
                        </div>
                        <button
                            type="button"
                            className={clsx(
                                'py-3 px-6 w-full bg-eth-gold/80 text-white font-bold rounded uppercase shadow transition cursor-pointer',
                                'hover:bg-eth-gold hover:shadow-lg'
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
