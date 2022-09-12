import { useState } from 'react';
import { RgbColorPicker } from 'react-colorful';

import { usePixelCanvasContext } from '../../contexts/PixelCanvasContext';
import RgbColorInput from '../Inputs/RGBColorInput';
import { PixelInfoSection } from './PixelInfo';
import clsx from "clsx";

export default function PixelColorInfo() {
    const { selectedColor, setSelectedColor, colorPickerEnabled, setColorPickerEnabled } = usePixelCanvasContext();

    const [pickerType, setPickerType] = useState<'picker' | 'input'>('picker');

    return (
        <PixelInfoSection name="Select Color">
            <div className="flex flex-col space-y-5">
                {pickerType === 'input' && (
                    <div className="flex flex-row gap-x-5 justify-center items-center pt-1">
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
                    <div className="small custom-pointers pt-1">
                        <RgbColorPicker
                            color={selectedColor}
                            onChange={setSelectedColor}
                            style={{
                                width: '100%',
                            }}
                        />
                    </div>
                )}
                <div className="flex justify-center space-x-2 items-center">
                    <button
                        type="button"
                        className="py-1 px-2 text-sm font-semibold bg-eth-light-gray/80 hover:bg-eth-light-gray rounded"
                        onClick={() => {
                            setPickerType(
                                pickerType === 'input' ? 'picker' : 'input'
                            );
                        }}
                    >
                        {pickerType === 'input' ? 'Use Picker' : 'Use RGB'}
                    </button>
                    <button
                        type="button"
                        className={clsx(
                            "py-1 px-2 text-sm font-semibold rounded text-white",
                            colorPickerEnabled ? 'bg-red-600/80 hover:red-600' : 'bg-eth-gray/80 hover:bg-eth-gray',
                        )}
                        onClick={() => setColorPickerEnabled((prev) => !prev)}
                    >
                        {colorPickerEnabled ? 'Exit Picker' : 'Pick Color'}
                    </button>
                </div>
            </div>
        </PixelInfoSection>
    );
}
