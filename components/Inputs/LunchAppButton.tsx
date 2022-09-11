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
import Link from 'next/link';

export const LunchButton = () => {
    return (
        <div className="flex-none">
            <Link href="/canvas">
                <button
                    type="button"
                    className={clsx(
                        'py-5 px-6 w-full bg-eth-gray/90 text-white font-bold rounded-xl shadow transition cursor-pointer',
                        'hover:bg-eth-gray hover:shadow-lg'
                    )}
                >
                    Lunch Dapp
                </button>
            </Link>
        </div>
    );
};
