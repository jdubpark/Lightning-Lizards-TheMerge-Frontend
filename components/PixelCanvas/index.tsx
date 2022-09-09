import { NextPage } from 'next';
import React, { useEffect, useRef } from 'react';
import panzoom from 'panzoom';
import { colorsBoard } from './colors';
import {
    CANVAS_DIMENSION,
    usePixelCanvasContext,
} from '../../contexts/PixelCanvasContext';

// Props interface
// with username set to string
interface Props {}

function randomRgb() {
    const o = Math.round;
    const r = Math.random;
    const s = 255;
    return { R: o(r() * s), G: o(r() * s), B: o(r() * s) };
}

const zoomBy = 0.1;

const bgDefault = {
    direction: 45,
    color: {
        dark: '#ccc',
        light: 'transparent',
    },
    size: 20,
    span: 100 / 4,
};

const bg = {
    ...bgDefault,
    doubleSize: bgDefault.size * 2,
    rest: 100 - bgDefault.span,
};

const createShadow = (size: number) => `${size}px ${size}px 10px #ccc inset`;
const shadowSize = 8;

const PixelCanvas: NextPage<Props> = (props) => {
    const { setSelectedCoordinates, selectedColor } = usePixelCanvasContext();

    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    const halfSize = CANVAS_DIMENSION / 2;

    useEffect(() => {
        if (canvasRef.current) {
            const context = canvasRef.current.getContext('2d');
            if (!context) return;
            context.imageSmoothingEnabled = false;

            const canvas = panzoom(canvasRef.current, {
                maxZoom: 50,
                minZoom: 0.8,
                autocenter: true,
                pinchSpeed: 0.6,
            });

            canvas.zoomAbs(halfSize, halfSize, 1);

            return () => {
                // safe destruction, lfg!!
                canvas.dispose();
            };
        }
    }, []);

    function getMousePos(canvas: any, evt: any) {
        const rect = canvas.getBoundingClientRect();
        return {
            x:
                ((evt.clientX - rect.left) / (rect.right - rect.left)) *
                canvas.width,
            y:
                ((evt.clientY - rect.top) / (rect.bottom - rect.top)) *
                canvas.height,
        };
    }

    function drawPixel(x: number, y: number, canvas: any) {
        const context: any = canvas.getContext('2d');
        context.fillStyle = `rgb(${selectedColor.r}, ${selectedColor.g}, ${selectedColor.b})`;
        context.fillRect(x, y, 1, 1);
    }

    function clickHandler(event: any) {
        /*
         * Finding the slected pixel
         */
        const canvas = canvasRef.current;
        if (!canvas) return;
        let { x, y } = getMousePos(canvas, event);
        x = Math.floor(x);
        y = Math.floor(y);
        drawPixel(x, y, canvas);
        setSelectedCoordinates({
            x,
            y,
        });
    }

    return (
        // <div className="canvas">
        //   <canvas ref={canvasRef} width={1000} height={1000} />
        // </div>
        <div
            style={{
                width: `${CANVAS_DIMENSION}px`,
                height: `${CANVAS_DIMENSION}px`,
                overflow: 'hidden',
                border: '2px solid #5A60D2',
                boxShadow: `${createShadow(shadowSize)}, ${createShadow(
                    -shadowSize
                )}`,
                backgroundColor: '#eee',
            }}
        >
            <canvas
                ref={canvasRef}
                onClick={clickHandler}
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
        </div>
    );
};

// export component
export default PixelCanvas;
