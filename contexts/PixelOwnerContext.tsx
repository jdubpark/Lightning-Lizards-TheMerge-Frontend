import {
    createContext,
    Dispatch,
    MutableRefObject,
    ReactNode,
    SetStateAction,
    useContext,
    useRef,
    useState,
} from 'react';
import { RgbColor } from 'react-colorful';
import ApiClient from '../utils/ApiClient';

export interface XYCoordinates {
    x: number;
    y: number;
}

interface PixelOwnerContextInterface {
    canvasRef: MutableRefObject<HTMLCanvasElement | null>;
    drawPixel: (
        x: number,
        y: number,
        canvas: HTMLCanvasElement,
        selectedColor: RgbColor
    ) => void;

    pixelsList: {
        coordinates: XYCoordinates;
        color: RgbColor;
        price: number[];
    }[];
    setPixelsList: Dispatch<
        SetStateAction<
            { coordinates: XYCoordinates; color: RgbColor; price: number[] }[]
        >
    >;
    viewUserPixels: boolean;
    setViewUserPixels: Dispatch<SetStateAction<boolean>>;
}

const PixelOwnerContext = createContext<PixelOwnerContextInterface | undefined>(
    undefined
);

export default function PixelOwnerContextProvider({
    children,
}: {
    children: ReactNode;
}) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    const [selectedPixelsList, setSelectedPixelsList] = useState<
        { coordinates: XYCoordinates; color: RgbColor; price: number[] }[]
    >([]);

    const [viewUserPixels, setViewUserPixels] = useState<boolean>(false);

    function drawPixel(
        x: number,
        y: number,
        canvas: HTMLCanvasElement,
        selectedColor: RgbColor
    ) {
        const context: any = canvas.getContext('2d');
        if (!context) return;
        context.fillStyle = `rgb(${selectedColor.r}, ${selectedColor.g}, ${selectedColor.b})`;
        context.fillRect(x, y, 1, 1);
    }

    return (
        <PixelOwnerContext.Provider
            value={{
                canvasRef,
                drawPixel,

                pixelsList: selectedPixelsList,
                setPixelsList: setSelectedPixelsList,

                viewUserPixels: false,
                setViewUserPixels,
            }}
        >
            {children}
        </PixelOwnerContext.Provider>
    );
}

export const usePixelOwnerContext = (): PixelOwnerContextInterface => {
    const context = useContext(PixelOwnerContext);
    if (context === undefined) {
        throw new Error('PixelOwner must be within PixelOwnerContextProvider');
    }

    return context;
};
