import clsx from 'clsx';
import { constants } from 'ethers';
import {useEffect, useState} from "react";

import { usePixelCanvasContext } from '../../contexts/PixelCanvasContext';
import {midEllipsis} from "../../utils/misc";
import ApiClient from "../../utils/ApiClient";
import {RgbColor} from "react-colorful";

function CoordinateItem({ name, value }: { name: string, value: number }) {
	return (
		<div className="flex space-x-2 items-center">
			<div className="w-5 h-5 text-sm bg-eth-gray text-white font-semibold uppercase rounded text-center">{name}</div>
			<div>{value}</div>
		</div>
	)
}

function InfoItem({ name, value, multiline }: { name: string, value: number | string, multiline?: boolean }) {
	// size is auto here & title is not uppercase-enforced
	return (
		<div className={clsx('flex space-x-2', multiline ? 'flex-col space-x-0 space-y-1 items-left' : 'items-center')}>
			<div className="p-1 w-12 text-xs bg-eth-gray text-white font-semibold rounded text-center">{name}</div>
			<div className={clsx(multiline && 'w-24')}>{value}</div>
		</div>
	)
}

interface PixelLocationInfoSectionProps {
	children: JSX.Element | JSX.Element[]
	name: string
}

function PixelLocationInfoSection({ children, name }: PixelLocationInfoSectionProps ) {
	return (
		<div className="py-4 px-6 bg-white rounded-lg shadow-xl overflow-hidden">
			<div className="font-semibold">{name}</div>
			<div className="flex flex-col space-y-1 pt-2">
				{children}
			</div>
		</div>
	)
}

export default function PixelLocationInfo() {
	const { selectedCoordinates, selectedColor, setSelectedColor } = usePixelCanvasContext();

	const [price, setPrice] = useState<number>(0)
	const [owner, setOwner] = useState<string>('')
	const [prevRGB, setPrevRGB] = useState<RgbColor>({ r: 0, g: 0, b: 0 })

	useEffect(() => {
		ApiClient.getCoordinateData(selectedCoordinates.x, selectedCoordinates.y)
			.then((cd) => {
				if (!cd) return
				setPrevRGB({ r: cd.color.R, g: cd.color.G, b: cd.color.B, })
				setPrice(cd.price)
				setOwner(cd.owner)
			})
	}, [selectedCoordinates])

	return (
		<div className="flex flex-col items-end space-y-6 -mr-6">
			<PixelLocationInfoSection name="Coordinate">
				<CoordinateItem name="x" value={selectedCoordinates.x} />
				<CoordinateItem name="y" value={selectedCoordinates.y} />
			</PixelLocationInfoSection>
			<PixelLocationInfoSection name="Pixel Info">
				<InfoItem name="Price" value={price !== 0 ? price : '—'} />
				<InfoItem name="Owner" value={owner !== '' && owner !== constants.AddressZero ? midEllipsis(owner, 9) : '—'} multiline />
				<InfoItem name="RGB" value={`(${prevRGB.r},${prevRGB.g},${prevRGB.b})`} multiline />
			</PixelLocationInfoSection>
		</div>
	);
};
