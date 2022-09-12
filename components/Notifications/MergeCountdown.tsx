import {FC, useCallback, useEffect, useState} from 'react';
import Web3 from 'web3';
import { chain } from 'wagmi';
import ApiClient from '../../utils/ApiClient';
import { BigNumber } from 'ethers';
import { MdOutlineClose } from 'react-icons/md';

const web3 = new Web3(chain.mainnet.rpcUrls.default);

interface MergeCountdown {
    hours: number;
    minutes: number;
    seconds: number;
}

// I'm a smol boi, don't touch me
function SmolTimer({ hours, minutes, seconds }: MergeCountdown) {
    return (
        <div>
            <div className="text-xl">Merge Countdown 🕒</div>
            <div className="flex space-x-2 whitespace-pre mt-2 text-xl font-semibold">
                <div>{`${hours} hr`}</div>
                <div>{`${minutes} min`}</div>
                <div>{`${seconds} sec`}</div>
            </div>
        </div>
    );
}

// I'm a bigly timer, don't mess with me
function BiglyTimer({ hours, minutes, seconds }: MergeCountdown) {
    return (
        <div className="flex space-x-2 whitespace-pre md:text-xl text-center text-2xl md:text-5xl font-semibold">
            <div>{`${hours} hr`}</div>
            <div>{`${minutes} min`}</div>
            <div>{`${seconds} sec`}</div>
        </div>
    );
}

function getTimeDestructured(mergeCountdownTime: BigNumber) {
    if (!mergeCountdownTime) return { hours: 0, minutes: 0, seconds: 0 };
    let totalSeconds = mergeCountdownTime.toNumber()
    const hours = Math.floor(mergeCountdownTime.toNumber() / 3600);
    totalSeconds %= 3600; // sub hours
    return {
        hours,
        minutes: Math.floor(totalSeconds / 60),
        seconds: totalSeconds % 60,
    };
}

export const MergeCountdown: FC = () => {
    const [mergeCountdownTimeSet, setMergeCountdownTimeSet] = useState(false);
    const [mergeCountdownTime, setMergeCountdownTime] = useState<BigNumber>();
    const [mergeCountdown, setMergeCountdown] = useState<MergeCountdown>({ hours: 0, minutes: 0, seconds: 0 });
    const [showTimerPopup, setShowTimerPopup] = useState(false);

    useEffect(() => {
        (async () => {
            const currentBlockNumber = await web3.eth.getBlockNumber();
            const { totalDifficulty } = await web3.eth.getBlock(currentBlockNumber);
            const hashRate = await ApiClient.getHashRate();
            const terminalTotalDifficulty = BigNumber.from(
                '58750000000000000000000'
            );
            if (terminalTotalDifficulty.gte(totalDifficulty)) {
                const remainingTime = terminalTotalDifficulty
                    .sub(totalDifficulty)
                    .div(hashRate);
                setMergeCountdownTime(remainingTime);
            } else {
                setMergeCountdownTime(BigNumber.from('0'));
            }
            setMergeCountdownTimeSet(true);
        })()
    }, []);

    useEffect(() => {
        if (!mergeCountdownTimeSet) return;
        const countdownInterval = setInterval(() => {
            setMergeCountdownTime((prevTime) =>
                prevTime && prevTime.gt(0) ? prevTime?.sub(1) : prevTime
            );
        }, 1000);
        return () => clearInterval(countdownInterval);
    }, [mergeCountdownTimeSet]);

    useEffect(() => {
        if (!mergeCountdownTime) return;
        setMergeCountdown(getTimeDestructured(mergeCountdownTime))
    }, [mergeCountdownTime])

    if (!showTimerPopup) {
        return (
            <div className="fixed flex flex-row justify-center w-full md:w-fit top-24 md:top-auto md:bottom-5 left-0 md:left-5">
                <button
                    className="px-10 py-5 rounded-xl text-white bg-black/70 hover:bg-black"
                    onClick={() => setShowTimerPopup(true)}
                >
                    <SmolTimer {...mergeCountdown} />
                </button>
            </div>
        );
    }

    return (
        <div className="absolute top-0 bottom-0 left-0 right-0 backdrop-blur flex flex-row justify-center items-center z-[9990]">
            <div
                className="relative bg-white px-10 md:px-20 pt-10 pb-10 rounded-lg width-clamp md:min-w-[500px]"
                style={{ marginTop: '72px' }}
            >
                <button
                    className="absolute top-5 md:top-10 right-5 md:right-10"
                    onClick={() => {
                        setShowTimerPopup(false);
                    }}
                >
                    <MdOutlineClose />
                </button>
                <p className="text-xl md:text-2xl font-bold">
                    Merge Countdown 🕒
                </p>
                <p className="text-sm md:text-xl mt-2 mb-10">
                    Time estimated until the Merge takes place
                </p>
                <BiglyTimer {...mergeCountdown} />
                <p className="mt-10 md:text-xl font-semibold text-center">
                    ***Time is ticking so don&apos;t miss out!***
                </p>
            </div>
        </div>
    );
};
