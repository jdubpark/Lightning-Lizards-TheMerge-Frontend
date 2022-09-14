import {
    MdOutlineModeEditOutline,
    MdOutlineRemoveRedEye,
} from 'react-icons/md';

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
import TwitterButton from '../Displays/twitterButton';
import { NFTMintButton } from '../Inputs/NFTMintButton';

export const Board = () => {
    const { canvasIsEditable, setCanvasIsEditable } = usePixelCanvasContext();

    return (
        <div className="flex flex-row gap-x-5 h-full my-10 items-start">
            <TxLoading />
            <PixelCanvas />
            <div
                className="hidden h-auto md:flex flex-col gap-y-5 w-[450px] z-10 px-5 pb-12 overflow-y-auto"
                style={{ maxHeight: 'calc(100vh - 180px)' }}
            >
                <PixelInfoSection
                    name={
                        <div className="flex justify-center space-x-2 items-center">
                            {canvasIsEditable ? (
                                <>
                                    <MdOutlineRemoveRedEye size="24px" />
                                    <div>Switch to View</div>
                                </>
                            ) : (
                                <>
                                    <MdOutlineModeEditOutline size="24px" />
                                    <div>Switch to Edit</div>
                                </>
                            )}
                        </div>
                    }
                    onClick={() => {
                        setCanvasIsEditable(!canvasIsEditable);
                    }}
                    compact
                />
                <PixelLocationInfo />
                <TwitterButton />
                {canvasIsEditable && (
                    <>
                        <PixelColorInfo />
                        <PixelsList />
                        <MintButton />
                        <NFTMintButton />
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
