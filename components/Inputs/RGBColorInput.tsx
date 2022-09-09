import { Dispatch, FC, SetStateAction, useEffect, useRef } from 'react';
import { RgbColor } from 'react-colorful';
import EightBitInput from './EightBitInput';
import clamp from 'lodash/clamp';
import { usePixelCanvasContext } from '../../contexts/PixelCanvasContext';

const RGBColorInput: FC = () => {
    const { selectedColor, setSelectedColor } = usePixelCanvasContext();

    const redRef = useRef<HTMLInputElement>(null);
    const greenRef = useRef<HTMLInputElement>(null);
    const blueRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (redRef.current) redRef.current.value = String(selectedColor.r);
        if (greenRef.current) greenRef.current.value = String(selectedColor.g);
        if (blueRef.current) blueRef.current.value = String(selectedColor.b);
    }, [selectedColor]);

    const inputChangeHandler = () => {
        // clamp values if outside of 0 and 255
        if (redRef.current)
            redRef.current.value = String(
                clamp(Number(redRef.current.value), 0, 255)
            );
        if (greenRef.current)
            greenRef.current.value = String(
                clamp(Number(greenRef.current.value), 0, 255)
            );
        if (blueRef.current)
            blueRef.current.value = String(
                clamp(Number(blueRef.current.value), 0, 255)
            );

        // update with new color
        const newColor = {
            r: redRef.current?.value ?? 0,
            g: greenRef.current?.value ?? 0,
            b: blueRef.current?.value ?? 0,
        };
        setSelectedColor(newColor as RgbColor);
    };

    return (
        <div className=" p-4 border-solid border-stone-800 border-2 rounded-lg">
            <div className="flex items-center my-1">
                <div className="w-1/3">Red:</div>
                <EightBitInput
                    className="w-1/2 py-2 rounded-lg"
                    ref={redRef}
                    onChange={inputChangeHandler}
                />
            </div>
            <div className="flex items-center my-1">
                <div className="w-1/3">Green:</div>
                <EightBitInput
                    className="w-1/2 py-2 rounded-lg"
                    ref={greenRef}
                    onChange={inputChangeHandler}
                />
            </div>
            <div className="flex items-center my-1">
                <div className="w-1/3">Blue:</div>
                <EightBitInput
                    className="w-1/2 py-2 rounded-lg"
                    ref={blueRef}
                    onChange={inputChangeHandler}
                />
            </div>
        </div>
    );
};

export default RGBColorInput;
