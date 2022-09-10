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
    const { selectedColor, selectedCoordinates, setWaitingForTxConfirmation } =
        usePixelCanvasContext();

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

            const unsignedTx =
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
        chain,
        mergeCanvasContract,
        selectedColor,
        selectedCoordinates,
        signer,
        switchNetworkAsync,
        bid,
    ]);

    return (
        <div className="flex-none">
            {isLoadingSigner ? (
                <div>Connect Wallet!</div>
            ) : (
                <PixelInfoSection name="Get pixels">
                    <input
                        placeholder="(Optional) Bid for pixel in eth"
                        value={bid}
                        onChange={(e) => {
                            if (
                                !Number.isNaN(e.target.value) &&
                                Number(e.target.value) >= 0
                            ) {
                                setBid(e.target.value);
                            }
                        }}
                        className="px-2 py-1 border-2 border-black"
                    />
                    <button
                        type="button"
                        className={clsx(
                            'py-5 px-6 w-full bg-eth-gray/90 text-white font-bold rounded-xl uppercase shadow transition cursor-pointer',
                            'hover:bg-eth-gray hover:shadow-lg'
                        )}
                        onClick={() => mintPixels()}
                    >
                        Mint
                    </button>
                </PixelInfoSection>
            )}
        </div>
    );
};
