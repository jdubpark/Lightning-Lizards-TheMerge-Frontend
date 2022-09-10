import {
    createContext,
    Dispatch,
    MutableRefObject,
    ReactNode,
    SetStateAction,
    useContext,
    useEffect,
    useRef,
    useState,
} from 'react';
import { RgbColor } from 'react-colorful';
import { useSigner } from 'wagmi';
import ApiClient, { CoordinateData } from '../utils/ApiClient';

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
    userPixelsList: CoordinateData[];

    canvasIsEditable: boolean;
    setCanvasIsEditable: Dispatch<SetStateAction<boolean>>;

    waitingForTxConfirmation: boolean;
    setWaitingForTxConfirmation: Dispatch<SetStateAction<boolean>>;
}

const PixelCanvasContext = createContext<
    PixelCanvasContextInterface | undefined
>(undefined);

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
        r: 255,
        g: 255,
        b: 255,
    });
    const [selectedPixelsList, setSelectedPixelsList] = useState<
        { coordinates: XYCoordinates; color: RgbColor }[]
    >([]);
    const [userPixelsList, setUserPixelsList] = useState<CoordinateData[]>([]);

    const [canvasIsEditable, setCanvasIsEditable] = useState(false);
    const [waitingForTxConfirmation, setWaitingForTxConfirmation] =
        useState(false);

    const fetchUserPixelsList = async () => {
        if (!signer) return;
        const signerAddress = await signer.getAddress();
        ApiClient.getUserPixels(signerAddress)
            .then((cd) => setUserPixelsList([...cd]))
            .catch((error) => {
                console.log(error);
            });
    };

    useEffect(() => {
        if (signer) {
            fetchUserPixelsList();
        }
    }, [signer]);

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
                userPixelsList,

                canvasIsEditable,
                setCanvasIsEditable,

                waitingForTxConfirmation,
                setWaitingForTxConfirmation,
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
