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
import { ethers } from 'ethers';

const createShadow = (size: number) => `${size}px ${size}px 10px #ccc inset`;
const shadowSize = 8;
const maxScaleFactor = 50;

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
        clearPixel,

        selectedCoordinates,
        setSelectedCoordinates,
        selectedColor,
        setSelectedColor,
        selectedPixelsList,
        setSelectedPixelsList,
        userPixelsList,

        canvasIsEditable,
        colorPickerEnabled,
        waitingForTxConfirmation,
    } = usePixelCanvasContext();

    // updates only on first render, used as force cache
    const timeRef = useRef<number>(Date.now());

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

            const canvasContainer = document.getElementById('canvas-container');
            if (!canvasContainer) return;

            console.log(
                canvasContainer.clientWidth,
                canvasContainer.clientHeight
            );

            const canvas = panzoom(canvasRef.current, {
                maxZoom: maxScaleFactor,
                minZoom: 0.9,
                autocenter: true,
                pinchSpeed: 0.6,
                initialX: CANVAS_DIMENSION / 2,
                initialY: 0,
                initialZoom: 20,
                // beforeMouseDown: function(e) {
                //     // allow mouse-down panning only if altKey is down. Otherwise - ignore
                //     return !e.altKey; // ignoring !e.altKey
                // }
            });

            canvas.zoomAbs(CANVAS_DIMENSION, CANVAS_DIMENSION, maxScaleFactor);
            canvas.moveTo(0, 0);

            setCanvasPanZoom(canvas);

            return () => {
                // safe destruction, lfg!!
                setCanvasPanZoom(null);
                canvas.dispose();
            };
        }
    }, [halfSize]);

    // Color the user's owned pixels
    useEffect(() => {
        if (canvasRef.current) {
            const canvas = canvasRef.current as HTMLCanvasElement;
            userPixelsList.forEach(({ _id, color, price }) => {
                const [x, y] = _id.split('-');
                console.log(x, y);
                drawPixel(Number(x), Number(y), canvas, {
                    r: color.R,
                    g: color.G,
                    b: color.B,
                });
            });
        }
    }, [canvasRef, userPixelsList]);

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

            if (diffX < delta && diffY < delta) {
                // is a click!

                let owner: string
                let price: string
                let pixelColor: RgbColor
                try {
                    const data =
                        await ApiClient.getCoordinateData(
                            newCoord.x,
                            newCoord.y
                        );
                    owner = data.owner;
                    price = data.price;
                    // voodoo magic, it lowercases the keys!
                    pixelColor = Object.fromEntries(
                        Object.entries(data.color).map(([k, v]) => [k.toLowerCase(), v])
                    ) as unknown as RgbColor
                } catch (err) {
                    console.log(err);
                    return;
                }

                if (canvasIsEditable) {
                    setSelectedColor(pixelColor)
                    return;
                }

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
                    try {
                        const parsedPrice = ethers.utils.parseUnits(
                            price,
                            'wei'
                        );
                        let minPrice = parsedPrice.add(
                            ethers.utils.parseEther('0.000')
                        );
                        if (
                            owner !==
                            '0x0000000000000000000000000000000000000000'
                        ) {
                            minPrice = parsedPrice.add(
                                ethers.utils.parseEther('0.001')
                            );
                        }
                        drawPixel(
                            newCoord.x,
                            newCoord.y,
                            canvas,
                            selectedColor
                        );
                        newSelectedPixelsList.push({
                            coordinates: newCoord,
                            color: selectedColor,
                            price: minPrice,
                            minPrice,
                        });
                    } catch (error) {
                        console.log(error);
                    }
                } else if (
                    selectedPixelsList[indexOfPixel].color !== selectedColor
                ) {
                    // Change the color of the pixel to the new selected color
                    drawPixel(newCoord.x, newCoord.y, canvas, selectedColor);
                    newSelectedPixelsList[indexOfPixel].color = selectedColor;
                } else {
                    // Remove the pixel and replace with most recent pixel coloring
                    newSelectedPixelsList.splice(indexOfPixel, 1);
                    clearPixel(newCoord.x, newCoord.y, canvas);
                    // Since we will be refreshing every block, no need to get immediate data
                    // await ApiClient.getCoordinateData(
                    //     selectedCoordinates.x,
                    //     selectedCoordinates.y
                    // ).then((cd) => {
                    //     if (!cd) return;
                    //     drawPixel(
                    //         newCoord.x,
                    //         newCoord.y,
                    //         canvas,
                    //         {
                    //             r: cd.color.R,
                    //             g: cd.color.G,
                    //             b: cd.color.B,
                    //         },
                    //         true
                    //     );
                    // });
                }
                setSelectedPixelsList([...newSelectedPixelsList]);
            }
        },
        [
            canvasRef,
            clearPixel,
            drawPixel,
            setSelectedPixelsList,
            canvasPanZoom,
            prevCoord,
            selectedColor,
            setSelectedCoordinates,
            selectedPixelsList,
            canvasIsEditable,
        ]
    );

    return (
        <div
            id="canvas-container"
            className="z-0 w-full flex flex-row items-start"
        >
            <div className="flex-grow outline-0 hover:outline-0 focus:outline-0 w-[0px]">
                <canvas
                    ref={canvasRef}
                    onMouseDown={onMouseDown}
                    onMouseUp={onMouseUp}
                    height={CANVAS_DIMENSION}
                    width={CANVAS_DIMENSION}
                    style={{
                        cursor: colorPickerEnabled
                            ? 'url(\'data:image/x-icon;base64,AAACAAEAICAQAAAAAADoAgAAFgAAACgAAAAgAAAAQAAAAAEABAAAAAAAAAIAAAAAAAAAAAAAEAAAAAAAAAAAAAAAh4eHAL+/vwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIQAAAAAAAAAAAAAAAAAAAgAAAAAAAAAAAAAAAAAAACEAAAAAAAAAAAAAAAAAAAIAAAAAAAAAAAAAAAAAAAAhAAAAAAAAAAAAAAAAAAACAAAAAAAAAAAAAAAAAAAAIQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD///////////////////////////////////////////////////////////////////////////////////////D////g///+AP///gD///8B////A////sP///0D///6M///9H///+j////R////o////0f///9P////H////w==\'), auto' :
                            canvasIsEditable ? 'crosshair' : 'cursor',
                        imageRendering: 'pixelated',
                        // height: CANVAS_DIMENSION,
                        // width: CANVAS_DIMENSION,
                        // opacity: canvasIsEditable ? 1 : 0.5,
                        backgroundImage: waitingForTxConfirmation
                            ? ''
                            : `url(https://merge-nft.s3.us-west-2.amazonaws.com/canvas.png?${timeRef.current})`,
                        // backgroundImage: waitingForTxConfirmation
                        //     ? ``
                        //     : `${
                        //           canvasIsEditable
                        //               ? 'linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), '
                        //               : ''
                        //       }url(https://merge-nft.s3.us-west-2.amazonaws.com/canvas.png)`,
                    }}
                />
            </div>
            <PixelChangeListener canvasRef={canvasRef} />
        </div>
    );
};

// export component
export default PixelCanvas;
