import { BigNumber, BigNumberish, ethers } from 'ethers';
import { FC, useCallback, useEffect, useState } from 'react';
import { RgbColor } from 'react-colorful';
import {
    usePixelCanvasContext,
    XYCoordinates,
} from '../../contexts/PixelCanvasContext';
import ApiClient from '../../utils/ApiClient';
import { formatPrice } from '../../utils/misc';
import { PixelInfoSection } from './PixelInfo';

type SelectedPixelsListItemProps = {
    index: number;
    coordinates: XYCoordinates;
    color: RgbColor;
    price: BigNumber;
};

const SelectedPixelsListItem: FC<SelectedPixelsListItemProps> = ({
    index,
    coordinates,
    color,
    price,
}) => {
    const { canvasRef, selectedPixelsList, setSelectedPixelsList, drawPixel } =
        usePixelCanvasContext();

    const [userPrice, setUserPrice] = useState(ethers.utils.formatEther(price));

    const deleteSelectedPixelHandler = useCallback(
        (index: number) => {
            const canvas = canvasRef.current;
            if (!canvas) return;
            const selectedPixel = selectedPixelsList[index];
            const newSelectedPixelsList = [...selectedPixelsList];
            newSelectedPixelsList.splice(index, 1);
            setSelectedPixelsList(newSelectedPixelsList);
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
        },
        [canvasRef, drawPixel, selectedPixelsList, setSelectedPixelsList]
    );

    const textColor =
        color.r * 0.299 + color.g * 0.587 + color.b * 0.114 > 186
            ? '#000000'
            : '#ffffff';

    const [inputValue, setInputValue] = useState<BigNumber>(
        selectedPixelsList[index].minPrice
    );

    return (
        <div key={index} className="flex flex-col gap-y-2">
            <div
                className={`flex flex-col justify-center items-center w-full aspect-square border-4 border-black`}
                style={{
                    backgroundColor: `rgb(${color.r}, ${color.g}, ${color.b})`,
                    color: textColor,
                }}
            >
                <div className="text-sm pt-1 font-semibold">
                    ({coordinates.x}, {coordinates.y})
                </div>
                <div>
                    <button
                        onClick={() => deleteSelectedPixelHandler(index)}
                        className="text-sm text-red-400 drop-shadow hover:font-semibold"
                    >
                        Delete
                    </button>
                </div>
            </div>
            <div>
                <p>
                    Min bid:{' '}
                    {ethers.utils.formatEther(
                        selectedPixelsList[index].minPrice
                    )}{' '}
                    ETH
                </p>
            </div>
            <div className="flex flex-row gap-x-2">
                <label>Bid: </label>
                <input
                    type="text"
                    value={userPrice}
                    onChange={(e) => {
                        try {
                            const newPrice =
                                e.target.value.replace(/[^0-9.]/g, '') || '0';
                            const newSelectedPixelsList = [
                                ...selectedPixelsList,
                            ];
                            newSelectedPixelsList[index].price =
                                ethers.utils.parseEther(newPrice);
                            setSelectedPixelsList([...newSelectedPixelsList]);
                            setUserPrice(newPrice);
                        } catch (error) {
                            console.log(error);
                        }
                    }}
                    className="border-2 border-black w-full px-2"
                />
            </div>
        </div>
    );
};

const SelectedPixelsList: FC = () => {
    const { selectedPixelsList } = usePixelCanvasContext();

    return (
        <>
            {selectedPixelsList.length === 0 ? (
                <p className="text-xl col-span-full">
                    No pixels have been selected
                </p>
            ) : (
                selectedPixelsList.map(
                    ({ coordinates, color, price }, index) => (
                        <SelectedPixelsListItem
                            key={`${coordinates.x}-${coordinates.y}`}
                            index={index}
                            coordinates={coordinates}
                            color={color}
                            price={price}
                        />
                    )
                )
            )}
        </>
    );
};

const UserPixelsList: FC = () => {
    const { userPixelsList } = usePixelCanvasContext();

    return (
        <>
            {userPixelsList.length === 0 ? (
                <p className="text-xl col-span-full">No pixels owned - yet</p>
            ) : (
                userPixelsList.map(({ _id, color, price }, index) => {
                    const [x, y] = _id.split('-');
                    return (
                        <div
                            key={index}
                            className="flex flex-col justify-center text-center"
                        >
                            <div
                                className={`w-full aspect-square border-4 border-black`}
                                style={{
                                    backgroundColor: `rgb(${color.R}, ${color.G}, ${color.B})`,
                                }}
                            />
                            <p className="text-sm">
                                ({x}, {y})
                            </p>
                            <p className="">{formatPrice(String(price))}</p>
                        </div>
                    );
                })
            )}
        </>
    );
};

enum PixelsListTab {
    SELECTED_PIXELS,
    USER_PIXELS,
}

export const PixelsList: FC = () => {
    const { selectedPixelsList, userPixelsList } = usePixelCanvasContext();

    const [tab, setTab] = useState<PixelsListTab>(
        PixelsListTab.SELECTED_PIXELS
    );
    const [showPopup, setShowPopup] = useState(false);

    return (
        <>
            <PixelInfoSection
                name={`Selected Pixels (${selectedPixelsList.length})`}
                onClick={() => setShowPopup(true)}
            />
            {showPopup && (
                <div className="absolute top-0 bottom-0 left-0 right-0 backdrop-blur flex flex-row justify-center items-center z-[9990]">
                    <div
                        className="bg-white px-20 pt-10 pb-10 rounded-lg width-clamp min-w-[500px]"
                        style={{ marginTop: '72px' }}
                    >
                        <div className="flex flex-row items-start justify-between">
                            <p className="mb-2 text-2xl font-semibold underline">
                                {tab === PixelsListTab.SELECTED_PIXELS
                                    ? 'Selected'
                                    : 'Owned'}{' '}
                                Pixels
                            </p>
                            <button
                                onClick={() => setShowPopup(false)}
                                className="py-1 px-2 rounded text-white bg-eth-gray/80 hover:bg-eth-gray"
                            >
                                Close
                            </button>
                        </div>
                        <div className="pb-5 flex flex-row items-center gap-x-2">
                            <button
                                onClick={() =>
                                    setTab(PixelsListTab.SELECTED_PIXELS)
                                }
                                className="py-1 px-2 rounded bg-eth-light-gray/80 hover:bg-eth-light-gray"
                            >
                                Selected
                            </button>
                            <button
                                onClick={() =>
                                    setTab(PixelsListTab.USER_PIXELS)
                                }
                                className="py-1 px-2 rounded bg-eth-light-gray/80 hover:bg-eth-light-gray"
                            >
                                Owned
                            </button>
                        </div>
                        <div className="grid grid-cols-2 gap-x-10 gap-y-10 pr-2 w-[500px] max-h-[500px] overflow-auto">
                            {tab === PixelsListTab.SELECTED_PIXELS ? (
                                <SelectedPixelsList />
                            ) : (
                                <UserPixelsList />
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
