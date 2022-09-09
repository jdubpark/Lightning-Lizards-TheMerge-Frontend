import PixelCanvas from './PixelCanvas';
import PixelLocationInfo from '../Displays/PixelLocationInfo';
import PixelColorInfo from '../Displays/PixelColorInfo';
import PixelCanvasContextProvider, {
    usePixelCanvasContext,
} from '../../contexts/PixelCanvasContext';
import { SelectedPixelsList } from '../Inputs/SelectedPixelsList';
import UserPixelsList from '../Displays/UserPixelsList';
import { PixelInfoSection } from '../Displays/PixelInfo';
import { MintButton } from '../Inputs/MintButton';

export const Board = () => {
    const { canvasIsEditable, setCanvasIsEditable } = usePixelCanvasContext();

    return (
        <div className="flex flex-row gap-x-5 h-full">
            <PixelCanvas />
            <div className="flex flex-col gap-y-5 w-[300px] z-10 mt-10">
                <PixelInfoSection
                    name={canvasIsEditable ? 'Edit Mode' : 'View Mode'}
                    onClick={() => {
                        setCanvasIsEditable(!canvasIsEditable);
                    }}
                >
                    <div />
                </PixelInfoSection>
                <PixelLocationInfo />
                {canvasIsEditable && (
                    <>
                        <PixelColorInfo />
                        <SelectedPixelsList />
                        <MintButton />
                    </>
                )}
                {/* <div>
                        <UserPixelsList />
                    </div> */}
            </div>
        </div>
    );
};
