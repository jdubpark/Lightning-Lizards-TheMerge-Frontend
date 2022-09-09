import { Dispatch, FC, SetStateAction, useEffect, useRef } from 'react';
import { RgbColor } from 'react-colorful';
import EightBitInput from './EightBitInput';
import clamp from 'lodash/clamp';

type ColorInputProps = {
    color: RgbColor;
    onChange: Dispatch<SetStateAction<RgbColor>>;
};

const RGBColorInput: FC<ColorInputProps> = ({ color, onChange }) => {
    const redRef = useRef<HTMLInputElement>(null);
    const greenRef = useRef<HTMLInputElement>(null);
    const blueRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (redRef.current) redRef.current.value = String(color.r);
        if (greenRef.current) greenRef.current.value = String(color.g);
        if (blueRef.current) blueRef.current.value = String(color.b);
    }, [color]);

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
        onChange(newColor as RgbColor);
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
