import { BigNumber } from 'ethers';
import {
    createContext,
    Dispatch,
    MutableRefObject,
    ReactNode,
    SetStateAction,
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState,
} from 'react';
import { RgbColor } from 'react-colorful';
import { useSigner } from 'wagmi';
import ApiClient, { CoordinateData } from '../utils/ApiClient';
import { SelectedPixelsList } from '../utils/types';

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
        selectedColor: RgbColor,
        lowOpacity?: boolean
    ) => void;
    clearPixel: (x: number, y: number, canvas: HTMLCanvasElement) => void;

    selectedCoordinates: XYCoordinates;
    setSelectedCoordinates: Dispatch<SetStateAction<XYCoordinates>>;
    selectedColor: RgbColor;
    setSelectedColor: Dispatch<SetStateAction<RgbColor>>;
    selectedPixelsList: {
        coordinates: XYCoordinates;
        color: RgbColor;
        price: BigNumber;
        minPrice: BigNumber;
    }[];
    setSelectedPixelsList: Dispatch<
        SetStateAction<
            {
                coordinates: XYCoordinates;
                color: RgbColor;
                price: BigNumber;
                minPrice: BigNumber;
            }[]
        >
    >;
    userPixelsList: CoordinateData[];

    canvasIsEditable: boolean;
    setCanvasIsEditable: Dispatch<SetStateAction<boolean>>;

    waitingForTxConfirmation: boolean;
    setWaitingForTxConfirmation: Dispatch<SetStateAction<boolean>>;

    colorPickerEnabled: boolean;
    setColorPickerEnabled: Dispatch<SetStateAction<boolean>>;
}

const PixelCanvasContext = createContext<
    PixelCanvasContextInterface | undefined
>(undefined);

// These functions don't rely on React FC,
// so pull them out here to reduce function re-rendering
function drawPixel(
    x: number,
    y: number,
    canvas: HTMLCanvasElement,
    selectedColor: RgbColor,
    lowOpacity?: boolean
) {
    const context = canvas.getContext('2d');
    if (!context) return;
    context.fillStyle = `rgba(${selectedColor.r}, ${selectedColor.g}, ${
        selectedColor.b
    }, ${lowOpacity ? 0.3 : 1})`;
    context.fillRect(x, y, 1, 1);
}

function clearPixel(x: number, y: number, canvas: HTMLCanvasElement) {
    const context = canvas.getContext('2d');
    if (!context) return;
    context.clearRect(x, y, 1, 1);
}

export default function PixelCanvasContextProvider({
    children,
}: {
    children: ReactNode;
}) {
    const { data: signer } = useSigner();

    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    const [selectedCoordinates, setSelectedCoordinates] =
        useState<XYCoordinates>({
            x: 0,
            y: 0,
        });
    const [selectedColor, setSelectedColor] = useState<RgbColor>({
        r: 78,
        g: 200,
        b: 239,
    });
    const [selectedPixelsList, setSelectedPixelsList] =
        useState<SelectedPixelsList>([]);
    const [userPixelsList, setUserPixelsList] = useState<CoordinateData[]>([]);

    const [canvasIsEditable, setCanvasIsEditable] = useState<boolean>(false);
    const [waitingForTxConfirmation, setWaitingForTxConfirmation] =
        useState<boolean>(false);

    const [colorPickerEnabled, setColorPickerEnabled] =
        useState<boolean>(false);

    const onEscapeKeyPressed = useCallback(
        (e: KeyboardEvent) => {
            if (e.key !== 'Escape' || !colorPickerEnabled) return;
            setColorPickerEnabled(false);
        },
        [colorPickerEnabled, setColorPickerEnabled]
    );

    useEffect(() => {
        if (!signer) return;
        signer.getAddress().then((address) => {
            ApiClient.getUserPixels(address)
                .then((cd) => setUserPixelsList([...cd]))
                .catch((error) => {
                    console.log(error);
                });
        });
    }, [signer]);

    useEffect(() => {
        document.addEventListener('keydown', onEscapeKeyPressed, false);
        return () => {
            document.removeEventListener('keydown', onEscapeKeyPressed, false);
        };
    }, [onEscapeKeyPressed]);

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
                userPixelsList,

                canvasIsEditable,
                setCanvasIsEditable,

                waitingForTxConfirmation,
                setWaitingForTxConfirmation,

                clearPixel,

                setColorPickerEnabled,
                colorPickerEnabled,
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
