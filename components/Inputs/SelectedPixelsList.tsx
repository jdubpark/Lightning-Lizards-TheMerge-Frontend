import { FC, useCallback, useState } from 'react';
import { usePixelCanvasContext } from '../../contexts/PixelCanvasContext';
import { RgbColor } from 'react-colorful';
import ApiClient from '../../utils/ApiClient';

type SelectedPixel = {
    coordinates: {
        x: number;
        y: number;
    };
    color: RgbColor;
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

    const addToListHandler = () => {
        // If the selected pixel is already in the list, remove it
        const newSelectedPixelsList = selectedPixelsList.filter(
            (p) =>
                !(
                    p.coordinates.x === selectedCoordinates.x &&
                    p.coordinates.y === selectedCoordinates.y
                )
        );
        // Add the selected pixel to the list
        newSelectedPixelsList.push({
            coordinates: selectedCoordinates,
            color: selectedColor,
        });

        setSelectedPixelsList([...newSelectedPixelsList]);
    };

    const deleteSelectedPixelHandler = (index: number) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const selectedPixel = selectedPixelsList[index];
        const newSelectedPixelsList = [...selectedPixelsList];
        newSelectedPixelsList.splice(index, 1);
        setSelectedPixelsList([...newSelectedPixelsList]);
        ApiClient.fetchCoordinateData(
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
        <div className="flex flex-row gap-x-5">
            {selectedPixelsList.map(({ coordinates, color }, index) => (
                <div key={index}>
                    <p>Pixel #{index}</p>
                    <button onClick={() => deleteSelectedPixelHandler(index)}>
                        Delete
                    </button>
                    <p>
                        ({coordinates.x}, {coordinates.y})
                    </p>
                    <div
                        className={`h-10 w-10 mt-3 border-4 border-black`}
                        style={{
                            backgroundColor: `rgb(${color.r}, ${color.g}, ${color.b})`,
                        }}
                    />
                </div>
            ))}
            {/* <button
                onClick={addToListHandler}
                className="px-2 py-2 border-2 border-black"
            >
                Add to list
            </button> */}
        </div>
    );
};
