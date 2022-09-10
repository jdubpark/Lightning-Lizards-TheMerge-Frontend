import { useCallback, useEffect, useState } from 'react';
import { RgbColorPicker } from 'react-colorful';
import {
    useContract,
    useContractWrite,
    useNetwork,
    usePrepareContractWrite,
    useSigner,
    useSwitchNetwork,
} from 'wagmi';

import { usePixelCanvasContext } from '../../contexts/PixelCanvasContext';
import RgbColorInput from '../Inputs/RGBColorInput';
import MergeCanvasArtifact from '../../contracts/MergeCanvas.json';
import { MERGE_CANVAS_CONTRACT_ADDRESS } from '../../utils/constants';
import { PixelInfoSection } from './PixelInfo';

export default function PixelColorInfo() {
    const { selectedCoordinates, selectedColor, setSelectedColor } =
        usePixelCanvasContext();

    const {
        data: signer,
        isError: isErrorSigner,
        isLoading: isLoadingSigner,
    } = useSigner();

    const [pickerType, setPickerType] = useState<'picker' | 'input'>('picker');

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

    return (
        <PixelInfoSection name="Select Color">
            <div className="flex flex-col space-y-5">
                {/* <div className="p-4 bg-eth-light-gray font-semibold text-xl text-center">
                Your On-Chain Pixel
            </div> */}

                {pickerType === 'input' && (
                    <div className="flex flex-row gap-x-5">
                        <div
                            className="h-28 w-20 border border-black rounded-lg"
                            style={{
                                backgroundColor: `rgb(${selectedColor.r}, ${selectedColor.g}, ${selectedColor.b})`,
                            }}
                        />
                        <RgbColorInput />
                    </div>
                )}
                {pickerType === 'picker' && (
                    <div>
                        <div className="small custom-pointers">
                            <RgbColorPicker
                                color={selectedColor}
                                onChange={setSelectedColor}
                                style={{
                                    width: '100%',
                                }}
                            />
                        </div>
                    </div>
                )}
                {/* <PixelInfoDivider name="Actions" /> */}
                <button
                    onClick={() => {
                        setPickerType(
                            pickerType === 'input' ? 'picker' : 'input'
                        );
                    }}
                >
                    Change Picker
                </button>
            </div>
        </PixelInfoSection>
    );
}
