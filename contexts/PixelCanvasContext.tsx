import {
    createContext,
    Dispatch,
    ReactNode,
    SetStateAction,
    useContext,
    useState,
} from 'react';
import { RgbColor } from 'react-colorful';

type XYCoordinates = {
    x: number;
    y: number;
};

interface PixelCanvasContextInterface {
    selectedCoordinates: XYCoordinates;
    setSelectedCoordinates: Dispatch<SetStateAction<XYCoordinates>>;
    selectedColor: RgbColor;
    setSelectedColor: Dispatch<SetStateAction<RgbColor>>;
}

const PixelCanvasContext = createContext<
    PixelCanvasContextInterface | undefined
>(undefined);

export const PixelCanvasContextProvider = ({
    children,
}: {
    children: ReactNode;
}) => {
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

    return (
        <PixelCanvasContext.Provider
            value={{
                selectedCoordinates,
                setSelectedCoordinates,
                selectedColor,
                setSelectedColor,
            }}
        >
            {children}
        </PixelCanvasContext.Provider>
    );
};

export const usePixelCanvasContext = (): PixelCanvasContextInterface => {
    const context = useContext(PixelCanvasContext);
    if (context === undefined) {
        throw new Error(
            'PixelCanvasContext must be within PixelCanvasContextProvider'
        );
    }

    return context;
};

export const CANVAS_DIMENSION = 600;
