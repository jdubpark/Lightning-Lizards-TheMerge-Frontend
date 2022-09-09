import { NextPage } from 'next';
import React, { useEffect, useRef } from 'react';
import panzoom from 'panzoom';
import { colorsBoard } from './colors';

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
    // using destructuring to get username
    // const { username } = props;
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const canvasSize = 600;

    const halfSize = canvasSize / 2;

    useEffect(() => {
        if (canvasRef.current) {
            const context = canvasRef.current.getContext('2d');
            if (!context) return;
            context.imageSmoothingEnabled = false;

            // const image = new Image()
            // image.src = 'https://i.redd.it/o4oku48qk9py.png'
            // image.src = out
            // image.onload = () => {
            //   context.drawImage(image, 0, 0)
            // }

            // Colors the canvas
            for (let i = 0; i < canvasSize; i++) {
                for (let j = 0; j < canvasSize; j++) {
                    // let key: any = i + '-' + j
                    const color = randomRgb();

                    context.fillStyle = `rgb(${color.R}, ${color.G}, ${color.B})`;
                    context.fillRect(i, j, 1, 1);
                }
            }

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

    function drawPixel(x: number, y: number, color: string, canvas: any) {
        const context: any = canvas.getContext('2d');
        const colorRGB: number[] = colorsBoard[color];
        context.fillStyle = `rgb(${colorRGB[0]}, ${colorRGB[1]}, ${colorRGB[2]})`;
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
        drawPixel(x, y, 'light grey', canvas);
        console.log(x, y);
    }

    return (
        // <div className="canvas">
        //   <canvas ref={canvasRef} width={1000} height={1000} />
        // </div>
        <div
            style={{
                width: `${canvasSize}px`,
                height: `${canvasSize}px`,
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
                height={canvasSize}
                width={canvasSize}
                style={{
                    cursor: 'crosshair',
                    imageRendering: 'pixelated',
                    // height: canvasSize,
                    // width: canvasSize,
                    backgroundImage: `
                linear-gradient(${bg.direction}deg, ${bg.color.dark} ${bg.span}%, ${bg.color.light} ${bg.span}%),
                linear-gradient(-${bg.direction}deg, ${bg.color.dark} ${bg.span}%, ${bg.color.light} ${bg.span}%),
                linear-gradient(${bg.direction}deg, ${bg.color.light} ${bg.rest}%, ${bg.color.dark} ${bg.rest}%),
                linear-gradient(-${bg.direction}deg, ${bg.color.light} ${bg.rest}%, ${bg.color.dark} ${bg.rest}%)`,
                    backgroundSize: `${bg.doubleSize}px ${bg.doubleSize}px`,
                    backgroundPosition: `0 0, 0 ${bg.size}px, ${bg.size}px -${bg.size}px, -${bg.size}px 0`,
                }}
            />
        </div>
    );
};

// export component
export default PixelCanvas;
