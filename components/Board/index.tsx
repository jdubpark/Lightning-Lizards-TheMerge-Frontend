import PixelCanvas from './PixelCanvas';
import { PixelInfo } from './PixelInfo';
import { PixelCanvasContextProvider } from '../../contexts/PixelCanvasContext';

export const Board = () => {
    return (
        <PixelCanvasContextProvider>
            <div className="flex flex-row gap-x-5">
                <PixelCanvas />
                <PixelInfo />
            </div>
        </PixelCanvasContextProvider>
    );
};
