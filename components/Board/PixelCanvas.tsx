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

function drawPixel(
    x: number,
    y: number,
    canvas: HTMLCanvasElement,
    selectedColor: RgbColor
) {
    const context: any = canvas.getContext('2d');
    context.fillStyle = `rgb(${selectedColor.r}, ${selectedColor.g}, ${selectedColor.b})`;
    context.fillRect(x, y, 1, 1);
}

const PixelCanvas: NextPage = (props) => {
    const { selectedCoordinates, setSelectedCoordinates, selectedColor } =
        usePixelCanvasContext();

    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [canvasPanZoom, setCanvasPanZoom] = useState<PanZoom | null>(null);

    const [prevCoord, setPrevCoord] = useState<XYCoordinates>({ x: 0, y: 0 });

    const halfSize = CANVAS_DIMENSION / 2;

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

            canvas.zoomAbs(halfSize, halfSize, 0.8);
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
        (e: React.MouseEvent) => {
            const canvas = canvasRef.current;
            if (!canvas || !canvasPanZoom) return;
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
                drawPixel(newCoord.x, newCoord.y, canvas, selectedColor);
            }
        },
        [prevCoord, selectedColor, setSelectedCoordinates]
    );

    return (
        <div
            style={{
                width: `${CANVAS_DIMENSION}px`,
                height: `${CANVAS_DIMENSION}px`,
                overflow: 'hidden',
                border: '2px solid #5A60D2',
                boxShadow: `${createShadow(shadowSize)}, ${createShadow(
                    -shadowSize
                )}`,
                backgroundColor: '#fff',
            }}
        >
            <canvas
                ref={canvasRef}
                onMouseDown={onMouseDown}
                onMouseUp={onMouseUp}
                height={CANVAS_DIMENSION}
                width={CANVAS_DIMENSION}
                style={{
                    cursor: 'crosshair',
                    imageRendering: 'pixelated',
                    // height: CANVAS_DIMENSION,
                    // width: CANVAS_DIMENSION,
                    backgroundImage:
                        'url(https://merge-nft.s3.us-west-2.amazonaws.com/canvas.png)',
                }}
            />
            <PixelChangeListener canvasRef={canvasRef} />
        </div>
    );
};

// export component
export default PixelCanvas;
