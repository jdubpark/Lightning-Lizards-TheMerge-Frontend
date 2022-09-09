import { BigNumber } from 'ethers';
import { FC, MutableRefObject } from 'react';
import { useBlockNumber, useContractEvent } from 'wagmi';
import MergeCanvasArtifact from '../../contracts/MergeCanvas.json';

const MergeCanvasABI = MergeCanvasArtifact.abi;
// Deployed to local hardhat node
const MERGE_CANVAS_CONTRACT_ADDRESS =
    '0x5FbDB2315678afecb367f032d93F642f64180aa3';

type ContractData = {
    addressOrName: string;
    contractInterface: any;
};

interface PixelChangeListenerProps {
    canvasRef: MutableRefObject<HTMLCanvasElement | null>;
}

export const PixelChangeListener: FC<PixelChangeListenerProps> = ({
    canvasRef,
}) => {
    const { data: initialBlockNumber, isError, isLoading } = useBlockNumber();

    const mergeCanvasContractData: ContractData = {
        addressOrName: MERGE_CANVAS_CONTRACT_ADDRESS,
        contractInterface: MergeCanvasABI,
    };

    // Currently seems to miss some events the occur in the MergeCanvas contract
    // useContractEvent(mergeCanvasContractData, 'PixelColorChanged', (event) => {
    //     colorCanvasPixel(event);
    // });
    useContractEvent({
        addressOrName: MERGE_CANVAS_CONTRACT_ADDRESS,
        contractInterface: MergeCanvasABI,
        eventName: 'PixelColorChanged',
        listener: (event) => colorCanvasPixel(event),
    })

    const colorCanvasPixel = (colorCanvasPixelEvent: unknown[]) => {
        console.log('colorCanvasPixel Event: ', colorCanvasPixelEvent);

        if (!canvasRef.current || !initialBlockNumber) return;

        const xCoordinate = colorCanvasPixelEvent[0] as number;
        const yCoordinate = colorCanvasPixelEvent[1] as number;
        const oldOwner = colorCanvasPixelEvent[2] as string;
        const newOwner = colorCanvasPixelEvent[3] as string;
        const oldRGB = colorCanvasPixelEvent[4] as number[];
        const newRGB = colorCanvasPixelEvent[5] as number[];
        const oldPrice = colorCanvasPixelEvent[6] as BigNumber;
        const newPrice = colorCanvasPixelEvent[7] as BigNumber;
        const blockInfo = colorCanvasPixelEvent[8] as { blockNumber: number };

        if (blockInfo.blockNumber < initialBlockNumber) return;

        console.log('coloring', xCoordinate, yCoordinate);

        const canvasContext = canvasRef.current.getContext('2d');
        if (canvasContext) {
            canvasContext.clearRect(xCoordinate, yCoordinate, 1, 1);
            canvasContext.fillStyle = `rgb(${newRGB[0]}, ${newRGB[1]}, ${newRGB[2]})`;
            canvasContext.fillRect(xCoordinate, yCoordinate, 1, 1);
        }
    };

    return null;
};
