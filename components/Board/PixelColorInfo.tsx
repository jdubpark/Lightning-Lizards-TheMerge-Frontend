import clsx from 'clsx'
import { utils, BigNumber as ethBigNumber, Contract } from 'ethers';
import { useCallback, useEffect, useState } from "react";
import { RgbColorPicker } from 'react-colorful';
import {useContract, useContractWrite, useNetwork, usePrepareContractWrite, useSigner, useSwitchNetwork} from 'wagmi';

import { usePixelCanvasContext } from '../../contexts/PixelCanvasContext';
import RgbColorInput from '../Inputs/RGBColorInput';
import MergeCanvasArtifact from '../../contracts/MergeCanvas.json';
import {MERGE_CANVAS_CONTRACT_ADDRESS} from "../../utils/constants";

function PixelInfoDivider({ name }: { name: string }) {
    return (
        <div className="relative flex items-center">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="flex-shrink mx-4 text-gray-400">{name}</span>
            <div className="flex-grow border-t border-gray-300"></div>
        </div>
    )
}

interface PixelInfoSectionProps {
    className?: string
    children: JSX.Element | JSX.Element[]
}

function PixelInfoSection({ children, className }: PixelInfoSectionProps) {
    return (
        <div className={clsx('px-6 flex justify-center', className)}>
            {children}
        </div>
    )
}

// const mergeCanvasInterface = new utils.Interface(MergeCanvasArtifact.abi)

export default function PixelColorInfo() {
    const { selectedCoordinates, selectedColor, setSelectedColor } = usePixelCanvasContext();
    const { chain } = useNetwork()
    const {
        chains, error: errorSwitchChain, isLoading: isLoadingSwitchChain, pendingChainId, switchNetworkAsync,
    } = useSwitchNetwork()
    const { data: signer, isError: isErrorSigner, isLoading: isLoadingSigner } = useSigner()

    const [mintCallData, setMintCallData] = useState<string>()

    // const { config } = usePrepareContractWrite({
    //     addressOrName: MERGE_CANVAS_CONTRACT_ADDRESS,
    //     contractInterface: MergeCanvasArtifact.abi,
    //     functionName: 'changePixelColor',
    //     // args: mintCallData,
    // })

    // const { data, isLoading, isSuccess, write: changePixelColorWrite } = useContractWrite({
    //     mode: 'recklesslyUnprepared',
    //     addressOrName: MERGE_CANVAS_CONTRACT_ADDRESS,
    //     contractInterface: MergeCanvasArtifact.abi,
    //     functionName: 'changePixelColor',
    //     args: mintCallData,
    // })
    const mergeCanvasContract = useContract({
        addressOrName: MERGE_CANVAS_CONTRACT_ADDRESS,
        contractInterface: MergeCanvasArtifact.abi,
        signerOrProvider: signer,
    }) as Contract

    const mintPixels = useCallback(async () => {
        if (!signer || !mergeCanvasContract || !chain || !switchNetworkAsync) return
        if (chain.id !== 5) await switchNetworkAsync(5)

        const unsignedTx = await mergeCanvasContract.populateTransaction.changePixelColor(
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
        )

        const txChangeColor = await signer.sendTransaction(unsignedTx)
        console.log(txChangeColor)
        console.log(await txChangeColor.wait())
    }, [chain, mergeCanvasContract, selectedColor, selectedCoordinates, signer, switchNetworkAsync]);


    return (
        <div className="flex flex-col space-y-5 w-64 bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-4 bg-eth-light-gray font-semibold text-xl text-center">Your On-Chain Pixel</div>
            <PixelInfoDivider name="Color" />
            <PixelInfoSection className="space-x-5 items-center">
                <div
                    className="h-28 w-20 border border-black rounded-lg"
                    style={{
                        backgroundColor: `rgb(${selectedColor.r}, ${selectedColor.g}, ${selectedColor.b})`,
                    }}
                />
                <RgbColorInput />
            </PixelInfoSection>
            <PixelInfoDivider name="Pick" />
            <PixelInfoSection>
                <div className="small custom-pointers">
                    <RgbColorPicker
                        color={selectedColor}
                        onChange={setSelectedColor}
                    />
                </div>
            </PixelInfoSection>
            <PixelInfoDivider name="Actions" />
            <PixelInfoSection>
                <div>
                    {isLoadingSigner ? <div>Connect Wallet!</div> : (
                        <button
                            type="button"
                            className={clsx(
                                'py-2 px-6 bg-eth-gray/90 text-white font-bold rounded-xl uppercase shadow transition cursor-pointer',
                                'hover:bg-eth-gray hover:shadow-lg'
                            )}
                            onClick={() => mintPixels()}
                        >
                            Mint
                        </button>
                    )}
                </div>
            </PixelInfoSection>
        </div>
    );
};
