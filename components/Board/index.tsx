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
            <div
                className="flex flex-col gap-y-5 w-[300px] z-10 my-10 overflow-y-auto"
                style={{ maxHeight: 'calc(100vh - 160px)' }}
            >
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
                <div className="hidden h-40" />
                {/* <div>
                        <UserPixelsList />
                    </div> */}
            </div>
        </div>
    );
};
