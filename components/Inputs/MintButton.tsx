import clsx from 'clsx';
import { utils, BigNumber as ethBigNumber, Contract, ethers } from 'ethers';
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
    const [bid, setBid] = useState('');

    const mergeCanvasContract = useContract({
        addressOrName: MERGE_CANVAS_CONTRACT_ADDRESS,
        contractInterface: MergeCanvasArtifact.abi,
        signerOrProvider: signer,
    }) as Contract;

    const mintPixels = useCallback(async () => {
        try {
            if (
                !signer ||
                !mergeCanvasContract ||
                !chain ||
                !switchNetworkAsync
            )
                return;
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
                        selectedPixelsList.map((_) => ethBigNumber.from(0))
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
                        // No need to ABI Encode
                        // https://docs.ethers.io/v5/api/utils/abi/coder/#AbiCoder-encode
                        // utils.defaultAbiCoder.encode(
                        //     ['tuple(uint8 R,uint8 G,uint8 B)'],
                        //     [
                        //         {
                        //             R: ethBigNumber.from(selectedColor.r),
                        //             G: ethBigNumber.from(selectedColor.g),
                        //             B: ethBigNumber.from(selectedColor.b),
                        //         },
                        //     ]
                        // )
                    );
            }

            const txChangeColor = await signer.sendTransaction({
                ...unsignedTx,
                value: ethers.utils.parseEther(bid || '0').toString(),
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
        bid,
        setWaitingForTxConfirmation,
        selectedCoordinates.x,
        selectedCoordinates.y,
        selectedColor.r,
        selectedColor.g,
        selectedColor.b,
    ]);

    const onBidInput = (e: any) => {
        if (
            !Number.isNaN(e.target.value) &&
            Number(e.target.value) >= 0
        ) {
            setBid(e.target.value);
        }
    }

    return (
        <div className="flex-none">
            {isLoadingSigner ? (
                <div>Connect Wallet!</div>
            ) : (
                <PixelInfoSection name="Get pixels">
                    <div className="flex flex-col space-y-2">
                        <div>
                            <div className="text-sm">Optional: Bid for Pixel (ETH)</div>
                            <input
                                placeholder="Bid for Pixel in ETH"
                                type="number"
                                value={bid}
                                onChange={onBidInput}
                                className="w-full px-2 py-1 mt-1 border border-eth-gray rounded focus:outline-0"
                            />
                        </div>
                        <div>
                            <button
                                type="button"
                                className={clsx(
                                    'py-3 px-6 w-full bg-eth-gold/80 text-white font-bold rounded uppercase shadow transition cursor-pointer',
                                    'hover:bg-eth-gold hover:shadow-lg'
                                )}
                                onClick={() => mintPixels()}
                            >
                                Mint
                            </button>
                        </div>
                    </div>
                </PixelInfoSection>
            )}
        </div>
    );
};
