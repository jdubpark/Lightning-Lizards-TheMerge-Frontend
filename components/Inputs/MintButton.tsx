import clsx from 'clsx';
import { utils, BigNumber as ethBigNumber, Contract } from 'ethers';
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

export const MintButton = () => {
    const { selectedColor, selectedCoordinates } = usePixelCanvasContext();

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

    const mintPixels = useCallback(async () => {
        if (!signer || !mergeCanvasContract || !chain || !switchNetworkAsync)
            return;
        if (chain.id !== 5) await switchNetworkAsync(5);

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

        const txChangeColor = await signer.sendTransaction(unsignedTx);
        console.log(txChangeColor);
        console.log(await txChangeColor.wait());
    }, [
        chain,
        mergeCanvasContract,
        selectedColor,
        selectedCoordinates,
        signer,
        switchNetworkAsync,
    ]);

    return (
        <div className="flex-none">
            {isLoadingSigner ? (
                <div>Connect Wallet!</div>
            ) : (
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
            )}
        </div>
    );
};
