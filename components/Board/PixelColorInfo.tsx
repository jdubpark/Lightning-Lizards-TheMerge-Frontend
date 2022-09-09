import clsx from 'clsx'
import { RgbColorPicker } from 'react-colorful';

import { usePixelCanvasContext } from '../../contexts/PixelCanvasContext';
import RgbColorInput from '../Inputs/RGBColorInput';
import {useCallback} from "react";

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

export default function PixelColorInfo() {
    const { selectedCoordinates, selectedColor, setSelectedColor } = usePixelCanvasContext();

    const mintPixels = useCallback(() => {

    }, [selectedCoordinates, selectedColor])

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
            <PixelInfoDivider name="Own!" />
            <PixelInfoSection>
                <button
                    type="button"
                    className={clsx(
                        'py-2 px-6 bg-eth-gray/90 text-white font-bold rounded-xl uppercase shadow transition cursor-pointer',
                        'hover:bg-eth-gray hover:shadow-lg'
                    )}
                    onClick={mintPixels}
                >
                    Mint
                </button>
            </PixelInfoSection>
        </div>
    );
};
