import { Dispatch, FC, SetStateAction, useEffect, useRef } from 'react';
import { RgbColor } from 'react-colorful';
import EightBitInput from './EightBitInput';

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
        const newColor = {
            r: redRef.current?.value ?? 0,
            g: greenRef.current?.value ?? 0,
            b: blueRef.current?.value ?? 0,
        };
        onChange(newColor as RgbColor);
    };

    return (
        <div className=" p-4 border-solid border-stone-800 border-2">
            <div>
                Red:
                <EightBitInput ref={redRef} onChange={inputChangeHandler} />
            </div>
            <div>
                Green:
                <EightBitInput ref={greenRef} onChange={inputChangeHandler} />
            </div>
            <div>
                Blue:
                <EightBitInput ref={blueRef} onChange={inputChangeHandler} />
            </div>
        </div>
    );
};

export default RGBColorInput;
