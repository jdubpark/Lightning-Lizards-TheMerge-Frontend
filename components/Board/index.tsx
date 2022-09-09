import PixelCanvas from './PixelCanvas';
import PixelLocationInfo from '../Displays/PixelLocationInfo';
import PixelColorInfo from '../Displays/PixelColorInfo';
import PixelCanvasContextProvider from '../../contexts/PixelCanvasContext';
import { SelectedPixelsList } from '../Inputs/SelectedPixelsList';
import UserPixelsList from '../Displays/UserPixelsList';

export const Board = () => {
    return (
        <PixelCanvasContextProvider>
            <div className="flex flex-row gap-x-5 h-full">
                <PixelCanvas />
                <div className="z-10 mt-10">
                    <PixelLocationInfo />
                </div>
            </div>
            {/* <div className="flex flex-col gap-y-6">
                <div className="flex flex-row gap-x-10 items-start">
                    <div>
                        <PixelLocationInfo />
                        <PixelColorInfo />
                    </div>a
                    <div className="flex-grow">
                        <PixelCanvas />
                    </div>
                </div>
                <div>
                    <SelectedPixelsList />
                </div>
                <div>
                    <UserPixelsList />
                </div>
            </div> */}
        </PixelCanvasContextProvider>
    );
};
