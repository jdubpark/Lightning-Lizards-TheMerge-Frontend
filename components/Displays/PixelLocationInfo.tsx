import clsx from 'clsx';
import { constants } from 'ethers';
import { useEffect, useState } from 'react';

import { usePixelCanvasContext } from '../../contexts/PixelCanvasContext';
import { midEllipsis } from '../../utils/misc';
import ApiClient from '../../utils/ApiClient';
import { RgbColor } from 'react-colorful';
import PixelColorInfo from './PixelColorInfo';

function InfoItem({ name, value }: { name: string; value: number | string }) {
    return (
        <div className="flex space-x-3 items-center">
            <div className="py-1 px-2 text-sm bg-eth-gray text-white font-semibold uppercase rounded text-center">
                {name}
            </div>
            <div>{value}</div>
        </div>
    );
}

interface PixelLocationInfoSectionProps {
    children: JSX.Element | JSX.Element[];
    name: string;
    isDisabled?: boolean;
    onClick?: () => void;
}

function PixelLocationInfoSection({
    children,
    name,
    isDisabled,
    onClick,
}: PixelLocationInfoSectionProps) {
    return (
        <div
            onClick={onClick}
            className={`py-4 px-6 bg-white rounded-lg shadow-xl overflow-hidden ${
                isDisabled
                    ? 'pointer-events-none hidden'
                    : 'pointer-events-auto'
            } ${onClick ? 'cursor-pointer' : 'cursor-auto'}`}
        >
            <div className="text-lg font-bold text-center">{name}</div>
            <div className="flex flex-col space-y-2 pt-2">{children}</div>
        </div>
    );
}

export default function PixelLocationInfo() {
    const {
        selectedCoordinates,
        selectedColor,
        setSelectedColor,
        canvasIsEditable,
        setCanvasIsEditable,
    } = usePixelCanvasContext();

    const [price, setPrice] = useState<number>(0);
    const [owner, setOwner] = useState<string>('');
    const [prevRGB, setPrevRGB] = useState<RgbColor>({ r: 0, g: 0, b: 0 });

    useEffect(() => {
        ApiClient.getCoordinateData(
            selectedCoordinates.x,
            selectedCoordinates.y
        ).then((cd) => {
            if (!cd) return;
            setPrevRGB({ r: cd.color.R, g: cd.color.G, b: cd.color.B });
            setPrice(cd.price);
            setOwner(cd.owner);
        });
    }, [selectedCoordinates]);

    return (
        <div className="flex flex-col gap-y-5 w-[300px]">
            <PixelLocationInfoSection
                name={canvasIsEditable ? 'Editor Mode' : 'View Mode'}
                onClick={() => setCanvasIsEditable(!canvasIsEditable)}
            >
                <div />
            </PixelLocationInfoSection>
            <PixelLocationInfoSection name="Pixel Info">
                <InfoItem name="x" value={selectedCoordinates.x} />
                <InfoItem name="y" value={selectedCoordinates.y} />
                <InfoItem name="Price" value={price !== 0 ? price : '—'} />
                <InfoItem
                    name="Owner"
                    value={
                        owner !== '' && owner !== constants.AddressZero
                            ? midEllipsis(owner, 9)
                            : '—'
                    }
                />
                <InfoItem
                    name="RGB"
                    value={`(${prevRGB.r},${prevRGB.g},${prevRGB.b})`}
                />
            </PixelLocationInfoSection>
            <PixelLocationInfoSection
                name="Pixel Color"
                isDisabled={!canvasIsEditable}
            >
                <PixelColorInfo />
            </PixelLocationInfoSection>
        </div>
    );
}
