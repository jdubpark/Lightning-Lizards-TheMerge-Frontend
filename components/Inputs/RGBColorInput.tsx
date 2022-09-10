import {
    Dispatch,
    FC,
    RefObject,
    SetStateAction,
    useCallback,
    useEffect,
    useRef,
} from 'react';
import { RgbColor } from 'react-colorful';
import EightBitInput from './EightBitInput';
import clamp from 'lodash/clamp';
import { usePixelCanvasContext } from '../../contexts/PixelCanvasContext';

function clampColor(val: string) {
    return clamp(Number(val), 0, 255).toString();
}

interface RGBColorInputItemProps {
    // ref: RefObject<HTMLInputElement>
    // inputChangeHandler: () => void
    name: string;
    children: JSX.Element | JSX.Element[];
}

function RGBColorInputItem({ name, children }: RGBColorInputItemProps) {
    return (
        <div className="flex items-center space-x-2">
            <div className="text-lg font-semibold w-5">{name}</div>
            {children}
        </div>
    );
}

export default function RGBColorInput() {
    const { selectedColor, setSelectedColor } = usePixelCanvasContext();

    const redRef = useRef<HTMLInputElement>(null);
    const greenRef = useRef<HTMLInputElement>(null);
    const blueRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (redRef.current) redRef.current.value = String(selectedColor.r);
        if (greenRef.current) greenRef.current.value = String(selectedColor.g);
        if (blueRef.current) blueRef.current.value = String(selectedColor.b);
    }, [selectedColor]);

    const inputChangeHandler = useCallback(() => {
        // clamp values if outside of 0 and 255
        if (redRef.current)
            redRef.current.value = clampColor(redRef.current.value);
        if (greenRef.current)
            greenRef.current.value = clampColor(greenRef.current.value);
        if (blueRef.current)
            blueRef.current.value = clampColor(blueRef.current.value);

        // update with new color
        const newColor = {
            r: redRef.current?.value ?? 0,
            g: greenRef.current?.value ?? 0,
            b: blueRef.current?.value ?? 0,
        };

        setSelectedColor(newColor as RgbColor);
    }, [setSelectedColor]);

    return (
        <div className="flex flex-col space-y-2 text-sm">
            <RGBColorInputItem name="R">
                <EightBitInput
                    className="py-1 px-2 w-16 rounded border border-gray-400"
                    ref={redRef}
                    onChange={inputChangeHandler}
                />
            </RGBColorInputItem>
            <RGBColorInputItem name="G">
                <EightBitInput
                    className="py-1 px-2 w-16 rounded border border-gray-400"
                    ref={greenRef}
                    onChange={inputChangeHandler}
                />
            </RGBColorInputItem>
            <RGBColorInputItem name="B">
                <EightBitInput
                    className="py-1 px-2 w-16 rounded border border-gray-400"
                    ref={blueRef}
                    onChange={inputChangeHandler}
                />
            </RGBColorInputItem>
        </div>
    );
}
