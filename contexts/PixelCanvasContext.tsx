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

export interface XYCoordinates {
    x: number;
    y: number;
}

interface PixelCanvasContextInterface {
    canvasRef: MutableRefObject<HTMLCanvasElement | null>;
    drawPixel: (
        x: number,
        y: number,
        canvas: HTMLCanvasElement,
        selectedColor: RgbColor
    ) => void;

    selectedCoordinates: XYCoordinates;
    setSelectedCoordinates: Dispatch<SetStateAction<XYCoordinates>>;
    selectedColor: RgbColor;
    setSelectedColor: Dispatch<SetStateAction<RgbColor>>;
    selectedPixelsList: { coordinates: XYCoordinates; color: RgbColor }[];
    setSelectedPixelsList: Dispatch<
        SetStateAction<{ coordinates: XYCoordinates; color: RgbColor }[]>
    >;

    canvasIsEditable: boolean;
    setCanvasIsEditable: Dispatch<SetStateAction<boolean>>;
}

const PixelCanvasContext = createContext<
    PixelCanvasContextInterface | undefined
>(undefined);

export default function PixelCanvasContextProvider({
    children,
}: {
    children: ReactNode;
}) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    const [selectedCoordinates, setSelectedCoordinates] =
        useState<XYCoordinates>({
            x: 0,
            y: 0,
        });
    const [selectedColor, setSelectedColor] = useState<RgbColor>({
        r: 255,
        g: 255,
        b: 255,
    });
    const [selectedPixelsList, setSelectedPixelsList] = useState<
        { coordinates: XYCoordinates; color: RgbColor }[]
    >([]);
    const [canvasIsEditable, setCanvasIsEditable] = useState(false);

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
        <PixelCanvasContext.Provider
            value={{
                canvasRef,
                drawPixel,

                selectedCoordinates,
                setSelectedCoordinates,
                selectedColor,
                setSelectedColor,
                selectedPixelsList,
                setSelectedPixelsList,

                canvasIsEditable,
                setCanvasIsEditable,
            }}
        >
            {children}
        </PixelCanvasContext.Provider>
    );
}

export const usePixelCanvasContext = (): PixelCanvasContextInterface => {
    const context = useContext(PixelCanvasContext);
    if (context === undefined) {
        throw new Error(
            'PixelCanvasContext must be within PixelCanvasContextProvider'
        );
    }

    return context;
};

export const CANVAS_DIMENSION = 500;
