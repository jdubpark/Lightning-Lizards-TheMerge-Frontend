import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useConnect } from 'wagmi';
import { useEffect, useRef } from 'react';
import { Board } from '../components/Board';
import PixelCanvasContextProvider from '../contexts/PixelCanvasContext';
import canvas from '../public/canvas2.png';
import { LunchButton } from '../components/Inputs/LunchAppButton';

function Header({ children }: { children: JSX.Element | JSX.Element[] }) {
    return (
        <header
            className="relative py-4 px-8 border-b border-eth-light-gray flex flex-row justify-between items-center bg-stone-200"
            style={{
                boxShadow: '0 0 20px 1px rgba(30,30,30,0.2)',
                zIndex: 10000,
            }}
        >
            {children}
        </header>
    );
}

function Footer({ children }: { children: JSX.Element | JSX.Element[] }) {
    return <footer className="p-4 bg-white text-center">{children}</footer>;
}
export function topImage() {
    return (
        <div className=" bg-blend-normal bg-cover bg-[url(../public/canvas2.png)]">
            <div className="flex flex-col justify-center items-center h-screen">
                <div className="flex flex-row justify-center items-center border-4 bg-black border-black ">
                    <div className="text-7xl font-bold text-white mar">
                        The Merge Canvas
                    </div>
                </div>
                <div className="flex flex-row justify-center items-center border-4 bg-black border-black ">
                    <div className="text-5xl font-bold text-white ">
                        A Collective Canvas for the ETH Merge
                    </div>
                </div>
            </div>
        </div>
    );
}

const Intro: NextPage = () => {
    function description() {
        return (
            <div className="flex flex-col justify-center h-screen">
                <div className="flex flex-col gap-y-10">
                    <div className="text-5xl font-bold text-black mar">
                        Own a Piece of Blockchain History By Contributing to
                        this Hybrid NFT Where Users Can Draw on the Canvas in
                        ETH 1.0 Up to the Merge and Become One of the Firsts to
                        Mint an NFT in ETH 2.0
                    </div>

                    <div className="text-5xl font-bold text-black mar">
                        Showcase Your Community Spirit, Support the ETH, and Get
                        a Proof You Were Part of the historical Moment of ETH
                        Merge
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="scroll-smooth overflow-y-scroll ">
            {topImage()}
            {description()}

            <Footer>
                <div className="text-eth-gray">
                    The Merge Canvas built with ❤️ by{' '}
                    <a href="https://twitter.com/outlierdao">Outliers</a>
                </div>
            </Footer>
        </div>
    );
};

export default Intro;
