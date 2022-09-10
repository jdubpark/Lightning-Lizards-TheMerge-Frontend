import { NextPage } from 'next';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import panzoom, { PanZoom } from 'panzoom';
import {
    CANVAS_DIMENSION,
    usePixelCanvasContext,
    XYCoordinates,
} from '../../contexts/PixelCanvasContext';
import { RgbColor } from 'react-colorful';
import { PixelChangeListener } from './PixelChangeListener';
import ApiClient from '../../utils/ApiClient';

const createShadow = (size: number) => `${size}px ${size}px 10px #ccc inset`;
const shadowSize = 8;

/**
 * Returns the floored coordinate {x,y} from mouse event
 * @param {HTMLCanvasElement} canvas
 * @param {React.MouseEvent} evt
 */
function getMousePos(
    canvas: HTMLCanvasElement,
    evt: React.MouseEvent
): XYCoordinates {
    const rect = canvas.getBoundingClientRect();
    const x =
        ((evt.clientX - rect.left) / (rect.right - rect.left)) * canvas.width;
    const y =
        ((evt.clientY - rect.top) / (rect.bottom - rect.top)) * canvas.height;
    return { x: Math.floor(x), y: Math.floor(y) };
}

const PixelCanvas: NextPage = (props) => {
    const {
        canvasRef,
        drawPixel,

        selectedCoordinates,
        setSelectedCoordinates,
        selectedColor,
        selectedPixelsList,
        setSelectedPixelsList,

        canvasIsEditable,
        waitingForTxConfirmation,
    } = usePixelCanvasContext();

    const [canvasPanZoom, setCanvasPanZoom] = useState<PanZoom | null>(null);

    const [prevCoord, setPrevCoord] = useState<XYCoordinates>({ x: 0, y: 0 });

    const halfSize = CANVAS_DIMENSION / 2;

    // useEffect(() => {
    //     const idx = canvasBackgroundAltRef.alt[0]
    //     canvasBackgroundRef.current[].src = `https://merge-nft.s3.us-west-2.amazonaws.com/canvas.png?${Date.now()}`
    // }, [])

    useEffect(() => {
        if (canvasRef.current) {
            const context = canvasRef.current.getContext('2d');
            if (!context) return;
            context.imageSmoothingEnabled = false;

            const canvas = panzoom(canvasRef.current, {
                maxZoom: 50,
                minZoom: 0.9,
                autocenter: true,
                pinchSpeed: 0.6,
                // beforeMouseDown: function(e) {
                //     // allow mouse-down panning only if altKey is down. Otherwise - ignore
                //     return !e.altKey; // ignoring !e.altKey
                // }
            });

            canvas.zoomAbs(halfSize, halfSize, 1);
            setCanvasPanZoom(canvas);

            return () => {
                // safe destruction, lfg!!
                setCanvasPanZoom(null);
                canvas.dispose();
            };
        }
    }, [halfSize]);

    const onMouseDown = useCallback(
        (e: React.MouseEvent) => {
            const canvas = canvasRef.current;
            if (!canvas) return;
            setPrevCoord(selectedCoordinates);
            setSelectedCoordinates(getMousePos(canvas, e));
        },
        [selectedCoordinates, setSelectedCoordinates]
    );

    const onMouseUp = useCallback(
        async (e: React.MouseEvent) => {
            const canvas = canvasRef.current;
            if (!canvas || !canvasPanZoom || !canvasIsEditable) return;
            const newCoord = getMousePos(canvas, e);

            // console.log(prevCoord, newCoord)
            // Check if it was a drag or a click
            // Multiply by scale to account for zoom
            const { scale } = canvasPanZoom.getTransform();
            const diffX = Math.abs(prevCoord.x - newCoord.x) * scale;
            const diffY = Math.abs(prevCoord.y - newCoord.y) * scale;
            const delta = 100; // 100 is a good number from trial and error

            console.log(diffX, diffY, delta, scale);
            if (diffX < delta && diffY < delta) {
                // is a click!

                setSelectedCoordinates(newCoord);
                // Check if the pixel has been previously selected
                const newSelectedPixelsList = [...selectedPixelsList];
                const indexOfPixel = selectedPixelsList.findIndex(
                    (p) =>
                        p.coordinates.x === newCoord.x &&
                        p.coordinates.y === newCoord.y
                );
                if (indexOfPixel === -1) {
                    // Newly selected pixel
                    drawPixel(newCoord.x, newCoord.y, canvas, selectedColor);
                    newSelectedPixelsList.push({
                        coordinates: newCoord,
                        color: selectedColor,
                    });
                } else if (
                    selectedPixelsList[indexOfPixel].color !== selectedColor
                ) {
                    // Change the color of the pixel to the new selected color
                    drawPixel(newCoord.x, newCoord.y, canvas, selectedColor);
                    newSelectedPixelsList[indexOfPixel].color = selectedColor;
                } else {
                    // Remove the pixel and replace with most recent pixel coloring
                    newSelectedPixelsList.splice(indexOfPixel, 1);
                    await ApiClient.getCoordinateData(
                        selectedCoordinates.x,
                        selectedCoordinates.y
                    ).then((cd) => {
                        if (!cd) return;
                        drawPixel(newCoord.x, newCoord.y, canvas, {
                            r: cd.color.R,
                            g: cd.color.G,
                            b: cd.color.B,
                        });
                    });
                }
                setSelectedPixelsList([...newSelectedPixelsList]);
            }
        },
        [
            canvasPanZoom,
            prevCoord.x,
            prevCoord.y,
            selectedColor,
            setSelectedCoordinates,
            selectedPixelsList,
            canvasIsEditable,
        ]
    );

    return (
        <div className="z-0 w-full">
            <canvas
                ref={canvasRef}
                onMouseDown={onMouseDown}
                onMouseUp={onMouseUp}
                height={CANVAS_DIMENSION}
                width={CANVAS_DIMENSION}
                style={{
                    cursor: canvasIsEditable ? 'crosshair' : 'cursor',
                    imageRendering: 'pixelated',
                    // height: CANVAS_DIMENSION,
                    // width: CANVAS_DIMENSION,
                    // opacity: canvasIsEditable ? 1 : 0.5,
                    opacity: 1,
                    backgroundImage: waitingForTxConfirmation
                        ? ``
                        : `url(https://merge-nft.s3.us-west-2.amazonaws.com/canvas.png)`,
                }}
            />
            <PixelChangeListener canvasRef={canvasRef} />
        </div>
    );
};

// export component
export default PixelCanvas;
