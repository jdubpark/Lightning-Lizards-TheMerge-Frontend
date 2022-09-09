import PixelCanvas from './PixelCanvas';
import { PixelInfo } from './PixelInfo';
import { PixelCanvasContextProvider } from '../../contexts/PixelCanvasContext';
import { SelectedPixelsList } from '../Inputs/SelectedPixelsList';

export const Board = () => {
    return (
        <PixelCanvasContextProvider>
            <div className="flex flex-row gap-x-5">
                <PixelCanvas />
                <div className="">
                    <PixelInfo />
                    <button className="mt-4 border-4 rounded-md bg-cyan-300 border-red-400 p-4 text-2xl">
                        Submit changes
                    </button>
                </div>
                <div>
                    <SelectedPixelsList />
                </div>
            </div>
        </PixelCanvasContextProvider>
    );
};
