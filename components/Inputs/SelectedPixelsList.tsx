import { FC, useState } from 'react';
import { usePixelCanvasContext } from '../../contexts/PixelCanvasContext';
import { RgbColor } from 'react-colorful';

type SelectedPixel = {
    coordinates: {
        x: number;
        y: number;
    };
    color: RgbColor;
};

export const SelectedPixelsList: FC = () => {
    const {
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
        console.log(newSelectedPixelsList);
        // Add the selected pixel to the list
        newSelectedPixelsList.push({
            coordinates: selectedCoordinates,
            color: selectedColor,
        });

        setSelectedPixelsList([...newSelectedPixelsList]);
    };

    const deleteSelectedPixelHandler = (index: number) => {
        const newSelectedPixelsList = [...selectedPixelsList];
        newSelectedPixelsList.splice(index, 1);
        setSelectedPixelsList([...newSelectedPixelsList]);
    };

    return (
        <div className="flex flex-col gap-y-5">
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
            <button
                onClick={addToListHandler}
                className="px-2 py-2 border-2 border-black"
            >
                Add to list
            </button>
        </div>
    );
};
