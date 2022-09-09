import { usePixelCanvasContext } from '../../contexts/PixelCanvasContext';
import {
    RgbColorPicker,
    RgbaStringColorPicker,
    HexColorInput,
} from 'react-colorful';
import RgbColorInput from '../Inputs/RGBColorInput';

export const PixelInfo = () => {
    const { selectedCoordinates, selectedColor, setSelectedColor } =
        usePixelCanvasContext();

    // console.log(selectedColor);

    return (
        <div>
            <h2 className="text-2xl font-semibold">Pixel Info</h2>
            <p className="text-2xl ">
                ({selectedCoordinates.x}, {selectedCoordinates.y})
            </p>
            <div
                className={`h-32 w-32 mt-3 border-4 border-black`}
                style={{
                    backgroundColor: `rgb(${selectedColor.r}, ${selectedColor.g}, ${selectedColor.b})`,
                }}
            />
            <RgbColorInput color={selectedColor} onChange={setSelectedColor} />
            <div className="mt-3">
                <RgbColorPicker
                    color={selectedColor}
                    onChange={setSelectedColor}
                />
            </div>
        </div>
    );
};
