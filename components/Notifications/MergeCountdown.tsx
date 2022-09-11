import { FC, useEffect, useState } from 'react';
import Web3 from 'web3';
import { chain } from 'wagmi';
import ApiClient from '../../utils/ApiClient';
import { BigNumber } from 'ethers';
import { MdOutlineClose } from 'react-icons/md';

const web3 = new Web3(chain.mainnet.rpcUrls.default);

export const MergeCountdown: FC = () => {
    const [mergeCoutdownTimeSet, setMergeCountdownTimeSet] = useState(false);
    const [mergeCountdownTime, setMergeCountdownTime] = useState<
        BigNumber | undefined
    >();
    const [showTimerPopup, setShowTimerPopup] = useState(false);

    const calculateMergeCountdownTime = async () => {
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
            setMergeCountdownTime(BigNumber.from(remainingTime));
        } else {
            setMergeCountdownTime(BigNumber.from(0));
        }

        setMergeCountdownTimeSet(true);
    };

    useEffect(() => {
        calculateMergeCountdownTime();
    }, []);

    useEffect(() => {
        if (mergeCoutdownTimeSet) {
            const countdownInterval = setInterval(() => {
                setMergeCountdownTime((prevTime) =>
                    prevTime && prevTime.gt(0) ? prevTime?.sub(1) : prevTime
                );
            }, 1000);
            return () => clearInterval(countdownInterval);
        }
    }, [mergeCoutdownTimeSet]);

    const getTimeDestructured = (): {
        days: number;
        hours: number;
        minutes: number;
        seconds: number;
    } => {
        if (!mergeCountdownTime)
            return { days: 0, hours: 0, minutes: 0, seconds: 0 };
        const seconds = mergeCountdownTime.mod(60).toNumber();
        const minutes = mergeCountdownTime.div(60).mod(60).toNumber();
        const hours = mergeCountdownTime
            .div(60 * 60)
            .mod(60)
            .toNumber();
        const days = mergeCountdownTime
            .div(60 * 60 * 24)
            .mod(60)
            .toNumber();

        return { days, hours, minutes, seconds };
    };

    const smallTimer = () => {
        const { days, hours, minutes, seconds } = getTimeDestructured();

        const numberFormatting = 'text-xl font-semibold';

        return (
            <div>
                <p className="text-xl">Merge Countdown 🕒</p>
                <p className="whitespace-pre mt-2">
                    <span className={numberFormatting}>{days}</span> day{'  '}
                    <span className={numberFormatting}>{hours}</span> hr{'  '}
                    <span className={numberFormatting}>{minutes}</span> min
                    {'  '}
                    <span className={numberFormatting}>{seconds}</span> sec
                </p>
            </div>
        );
    };

    if (!showTimerPopup) {
        return (
            <div className="fixed flex flex-row justify-center w-full md:w-fit top-24 md:top-auto md:bottom-5 left-0 md:left-5">
                <button
                    className="px-10 py-5 rounded-xl text-white bg-black/70 hover:bg-black"
                    onClick={() => setShowTimerPopup(true)}
                >
                    {smallTimer()}
                </button>
            </div>
        );
    }

    const largeTimer = () => {
        const { days, hours, minutes, seconds } = getTimeDestructured();

        const numberFormatting = 'text-2xl md:text-5xl font-semibold';

        return (
            <div>
                <p className="whitespace-pre md:text-xl text-center">
                    <span className={numberFormatting}>{days}</span> day{'  '}
                    <span className={numberFormatting}>{hours}</span> hr{'  '}
                    <span className={numberFormatting}>{minutes}</span> min
                    {'  '}
                    <span className={numberFormatting}>{seconds}</span> sec
                </p>
            </div>
        );
    };

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
                {largeTimer()}
                <p className="mt-10 md:text-xl font-semibold text-center">
                    ***Time is ticking so don&apos;t miss out!***
                </p>
            </div>
        </div>
    );
};
