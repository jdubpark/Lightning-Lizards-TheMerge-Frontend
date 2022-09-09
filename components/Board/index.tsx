import PixelCanvas from './PixelCanvas';
import PixelLocationInfo from './PixelLocationInfo';
import PixelColorInfo  from './PixelColorInfo';
import PixelCanvasContextProvider  from '../../contexts/PixelCanvasContext';
import { SelectedPixelsList } from '../Inputs/SelectedPixelsList';

export const Board = () => {
    return (
        <PixelCanvasContextProvider>
            <div className="flex flex-col gap-y-6">
                <div className="flex flex-row gap-x-12 items-stretch">
                    <PixelLocationInfo />
                    <PixelCanvas />
                    <PixelColorInfo />
                </div>
                <div>
                    <SelectedPixelsList />
                </div>
            </div>
        </PixelCanvasContextProvider>
    );
};
