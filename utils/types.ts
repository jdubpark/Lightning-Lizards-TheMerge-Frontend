import {RgbColor} from "react-colorful";
import {BigNumber} from "ethers";
import {XYCoordinates} from "../contexts/PixelCanvasContext";

export interface SelectedPixel {
	coordinates: XYCoordinates;
	color: RgbColor;
	price: BigNumber;
	minPrice: BigNumber;
}

export type SelectedPixelsList = SelectedPixel[]
