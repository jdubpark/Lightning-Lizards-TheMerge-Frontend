import { usePixelCanvasContext } from '../../contexts/PixelCanvasContext';
import { RgbColorPicker } from 'react-colorful';
import RgbColorInput from '../Inputs/RGBColorInput';

function PixelInfoDivider({ name }: { name: string }) {
    return (
        <div className="relative flex items-center">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="flex-shrink mx-4 text-gray-400">{name}</span>
            <div className="flex-grow border-t border-gray-300"></div>
        </div>
    )
}

export default function PixelColorInfo() {
    const { selectedCoordinates, selectedColor, setSelectedColor } = usePixelCanvasContext();

    return (
        <div className="flex flex-col space-y-5 w-64 bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-4 bg-eth-light-gray font-semibold text-xl text-center">Your On-Chain Pixel</div>
            <PixelInfoDivider name="Color" />
            <div className="px-6 flex space-x-5 items-center justify-center">
                <div
                    className="h-28 w-20 border border-black rounded-lg"
                    style={{
                        backgroundColor: `rgb(${selectedColor.r}, ${selectedColor.g}, ${selectedColor.b})`,
                    }}
                />
                <RgbColorInput />
            </div>
            <PixelInfoDivider name="Pick" />
            <div className="px-6 flex justify-center">
                <section className="small example custom-pointers">
                    <RgbColorPicker
                        color={selectedColor}
                        onChange={setSelectedColor}
                    />
                </section>
            </div>
            <PixelInfoDivider name="Own!" />
        </div>
    );
};
