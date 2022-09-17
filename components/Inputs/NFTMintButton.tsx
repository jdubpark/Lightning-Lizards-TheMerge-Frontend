import clsx from 'clsx';
import { providers, BigNumber, BigNumberish, Contract } from 'ethers';
import { useEffect, useState, useCallback } from 'react';
import { toast, ToastOptions } from 'react-toastify';
import { useNetwork, useSwitchNetwork, useSigner, useContract } from 'wagmi';

import {
    IS_PRODUCTION,
    MERGE_CANVAS_CONTRACT_ADDRESS,
    MERGE_NFT_CONTRACT_ADDRESS,
} from '../../utils/constants';
import MergeNFTArtifact from '../../contracts/MergeNFT.json';
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
};

export const NFTMintButton = () => {
    const { setWaitingForTxConfirmation } = usePixelCanvasContext();

    const {
        data: signer,
        // isError: isErrorSigner,
        isLoading: isLoadingSigner,
    } = useSigner();

    const { chain } = useNetwork();
    const { switchNetworkAsync } = useSwitchNetwork();

    const [isOwnButtonDisabled, setIsOwnButtonDisabled] = useState<boolean>();

    const mergeNFTContract = useContract({
        addressOrName: MERGE_NFT_CONTRACT_ADDRESS,
        contractInterface: MergeNFTArtifact.abi,
        signerOrProvider: signer,
    }) as Contract;

    const ownNFT = useCallback(async () => {
        try {
            if (!signer || !mergeNFTContract || !chain || !switchNetworkAsync)
                return;

            setIsOwnButtonDisabled(true);
            // if (chain.id !== 5) await switchNetworkAsync(5);
            let gasLimit: BigNumber | undefined;

            if (!IS_PRODUCTION) {
                await mergeNFTContract.estimateGas['mint']()
                    .then((limit) => (gasLimit = limit))
                    .catch((error) => console.log(error));
                if (gasLimit) {
                    (gasLimit = BigNumber.from(
                        Math.floor(gasLimit.toNumber() * 1.5)
                    )),
                        console.log('Gas limit', gasLimit.toString());
                }
            } else {
                gasLimit = undefined;
            }

            const unsignedTx = await mergeNFTContract.populateTransaction[
                'mint'
            ]();
            let tx = await signer.sendTransaction({
                ...unsignedTx,
                gasLimit,
            });

            toast('🦄 Your NFT is being minted!', toastConfig);
            tx.wait().then((receipt) => {
                console.log('Transaction receipt', receipt);
                toast('🥳 Your NFT has been minted!', toastConfig);
            });
        } catch (error) {
            console.error(error);
        } finally {
            setWaitingForTxConfirmation(false);
            setIsOwnButtonDisabled(false);
        }
    }, [
        signer,
        mergeNFTContract,
        chain,
        switchNetworkAsync,
        setWaitingForTxConfirmation,
    ]);

    return (
        <div className="flex-none">
            {isLoadingSigner ? (
                <div>Connect Wallet!</div>
            ) : (
                <div className="flex flex-col space-y-2">
                    <button
                        type="button"
                        className={clsx(
                            'py-3 px-6 w-full bg-eth-gold/80 text-white font-bold rounded uppercase shadow transition cursor-pointer',
                            'hover:bg-eth-gold hover:shadow-lg',
                            isOwnButtonDisabled &&
                                'bg-eth-gray opacity-40 cursor-none'
                        )}
                        onClick={() => ownNFT()}
                    >
                        Mint NFT
                    </button>
                </div>
            )}
        </div>
    );
};
