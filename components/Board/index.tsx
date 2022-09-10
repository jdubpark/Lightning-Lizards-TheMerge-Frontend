import { MdOutlineModeEditOutline, MdOutlineRemoveRedEye } from 'react-icons/md'

import PixelCanvas from './PixelCanvas';
import PixelLocationInfo from '../Displays/PixelLocationInfo';
import PixelColorInfo from '../Displays/PixelColorInfo';
import PixelCanvasContextProvider, {
    usePixelCanvasContext,
} from '../../contexts/PixelCanvasContext';
import { PixelsList } from '../Displays/PixelsList';
import { PixelInfoSection } from '../Displays/PixelInfo';
import { MintButton } from '../Inputs/MintButton';
import { TxLoading } from '../Displays/TxLoading';

export const Board = () => {
    const { canvasIsEditable, setCanvasIsEditable } = usePixelCanvasContext();

    return (
        <div className="flex flex-row gap-x-5 h-full my-10">
            <TxLoading />
            <PixelCanvas />
            <div
                className="flex flex-col gap-y-5 w-[450px] z-10 px-5 overflow-y-auto"
                style={{ maxHeight: 'calc(100vh - 160px)' }}
            >
                <PixelInfoSection
                    name={(
                        <div className="flex justify-center space-x-2 items-center">
                            {
                                canvasIsEditable ? (
                                    <>
                                        <MdOutlineRemoveRedEye size="24px" />
                                        <div>Switch to View</div>
                                    </>
                                ) : (
                                    <>
                                        <MdOutlineModeEditOutline size="24px" />
                                        <div>Switch to Edit</div>
                                    </>
                                )
                            }
                        </div>
                    )}
                    onClick={() => {
                        setCanvasIsEditable(!canvasIsEditable);
                    }}
                    compact
                />
                <PixelLocationInfo />
                {canvasIsEditable && (
                    <>
                        <PixelColorInfo />
                        <PixelsList />
                        <MintButton />
                    </>
                )}
                <div className="hidden h-screen" />
                {/* <div>
                        <UserPixelsList />
                    </div> */}
            </div>
        </div>
    );
};
