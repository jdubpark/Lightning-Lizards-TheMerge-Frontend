import { FC, useEffect, useState } from 'react';
import { usePixelCanvasContext } from '../../contexts/PixelCanvasContext';

// Time (in ms) to allow for update of PNG in backend
const pngUpdateDelay = 3 * 1000;

export const TxLoading: FC = () => {
    const { waitingForTxConfirmation } = usePixelCanvasContext();

    const [showPopup, setShowPopup] = useState(true);

    useEffect(() => {
        if (waitingForTxConfirmation) {
            setShowPopup(true);
        } else {
            const hidePopupTimeout = setTimeout(() => {
                setShowPopup(false);
            }, pngUpdateDelay);
            return () => clearTimeout(hidePopupTimeout);
        }
    }, [waitingForTxConfirmation]);

    if (!showPopup) {
        return null;
    }

    return (
        <div className="absolute top-0 left-0 right-0 bottom-0 z-50 backdrop-blur flex flex-row justify-center items-center">
            <div className="bg-white px-20 py-10 rounded-lg">
                <p className="text-2xl font-semibold whitespace-pre text-center">
                    {waitingForTxConfirmation
                        ? 'Waiting for Transaction Confirmation...'
                        : 'Transaction Confirmed! 🎉\n Updating Canvas...'}
                </p>
            </div>
        </div>
    );
};
