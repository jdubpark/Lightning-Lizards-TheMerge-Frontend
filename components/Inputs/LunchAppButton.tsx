import clsx from 'clsx';
import { utils, BigNumber as ethBigNumber, Contract } from 'ethers';
import { useState, useCallback } from 'react';
import {
    useNetwork,
    useSwitchNetwork,
    useSigner,
    chain,
    useContract,
} from 'wagmi';
import { MERGE_CANVAS_CONTRACT_ADDRESS } from '../../utils/constants';
import MergeCanvasArtifact from '../../contracts/MergeCanvas.json';
import { usePixelCanvasContext } from '../../contexts/PixelCanvasContext';

export const LunchButton = () => {
    const lunchApp = useCallback(async () => {}, []);

    return (
        <div className="flex-none">
            <button
                type="button"
                className={clsx(
                    'py-5 px-6 w-full bg-eth-gray/90 text-white font-bold rounded-xl shadow transition cursor-pointer',
                    'hover:bg-eth-gray hover:shadow-lg'
                )}
                onClick={() => lunchApp()}
            >
                Lunch Dapp
            </button>
        </div>
    );
};
