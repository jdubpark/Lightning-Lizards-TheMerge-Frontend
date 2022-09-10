import { FC, useCallback, useEffect, useState } from 'react';
import { RgbColor } from 'react-colorful';
import {
    usePixelCanvasContext,
    XYCoordinates,
} from '../../contexts/PixelCanvasContext';
import ApiClient from '../../utils/ApiClient';
import { PixelInfoSection } from '../Displays/PixelInfo';

type SelectedPixelsListItemProps = {
    index: number;
    coordinates: XYCoordinates;
    color: RgbColor;
};

const SelectedPixelsListItem: FC<SelectedPixelsListItemProps> = ({
    index,
    coordinates,
    color,
}) => {
    const { canvasRef, selectedPixelsList, setSelectedPixelsList, drawPixel } =
        usePixelCanvasContext();

    const deleteSelectedPixelHandler = (index: number) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const selectedPixel = selectedPixelsList[index];
        const newSelectedPixelsList = [...selectedPixelsList];
        newSelectedPixelsList.splice(index, 1);
        setSelectedPixelsList([...newSelectedPixelsList]);
        ApiClient.getCoordinateData(
            selectedPixel.coordinates.x,
            selectedPixel.coordinates.y
        ).then((cd) => {
            if (!cd) return;
            drawPixel(
                selectedPixel.coordinates.x,
                selectedPixel.coordinates.y,
                canvas,
                {
                    r: cd.color.R,
                    g: cd.color.G,
                    b: cd.color.B,
                }
            );
        });
    };

    return (
        <div key={index} className="flex flex-col justify-center text-center">
            <div
                className={`h-16 w-16 mt-3 border-4 border-black`}
                style={{
                    backgroundColor: `rgb(${color.r}, ${color.g}, ${color.b})`,
                }}
            />
            <p className="text-sm">
                ({coordinates.x}, {coordinates.y})
            </p>
            <button
                onClick={() => deleteSelectedPixelHandler(index)}
                className="text-red-400"
            >
                Delete
            </button>
        </div>
    );
};

export const SelectedPixelsList: FC = () => {
    const {
        canvasRef,
        drawPixel,

        selectedColor,
        selectedCoordinates,
        selectedPixelsList,
        setSelectedPixelsList,
    } = usePixelCanvasContext();

    const [showPopup, setShowPopup] = useState(false);

    return (
        <>
            <PixelInfoSection
                name={`Selected Pixels (${selectedPixelsList.length})`}
                onClick={() => setShowPopup(true)}
            >
                <div />
            </PixelInfoSection>
            {showPopup && (
                <div className="absolute top-0 bottom-0 left-0 right-0 backdrop-blur flex flex-row justify-center items-center z-10">
                    <div className="bg-white px-20 pt-10 pb-10 rounded-lg width-clamp ">
                        <div className="flex flex-row items-start justify-between">
                            <p className="mb-5 text-2xl font-semibold">
                                Selected pixels
                            </p>
                            <button onClick={() => setShowPopup(false)}>
                                Close
                            </button>
                        </div>
                        <div className="flex flex-row flex-wrap gap-x-10 gap-y-5 max-w-[500px] max-h-[500px] overflow-auto">
                            {selectedPixelsList.length === 0 ? (
                                <p className="text-xl">
                                    No pixels have been selected
                                </p>
                            ) : (
                                selectedPixelsList.map(
                                    ({ coordinates, color }, index) => (
                                        <SelectedPixelsListItem
                                            key={`${coordinates.x}-${coordinates.y}`}
                                            index={index}
                                            coordinates={coordinates}
                                            color={color}
                                        />
                                    )
                                )
                            )}
                        </div>
                        {/* <button
                onClick={addToListHandler}
                className="px-2 py-2 border-2 border-black"
            >
                Add to list
            </button> */}
                    </div>
                </div>
            )}
        </>
    );
};
