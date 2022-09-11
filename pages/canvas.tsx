import type { NextPage } from 'next';
import Head from 'next/head';
// import Image from 'next/image';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Board } from '../components/Board';
import PixelCanvasContextProvider from '../contexts/PixelCanvasContext';
import { BrowserCheck } from '../components/Displays/BrowserWarning';

function Header({ children }: { children: JSX.Element | JSX.Element[] }) {
    return (
        <header
            className="sticky inset-x-0 top-0 w-screen backdrop-filter backdrop-blur-3xl bg-white/30 dark:bg-black/30 shadow z-[9980]"
            style={{
                boxShadow: '0 0 20px 1px rgba(30,30,30,0.2)',
                zIndex: 9980,
            }}
        >
            <div className="relative py-4 px-8 flex flex-row justify-between items-center">
                {children}
            </div>
        </header>
    );
}

function Footer({ children }: { children: JSX.Element | JSX.Element[] }) {
    return <footer className="p-4 bg-white text-center">{children}</footer>;
}

const Home: NextPage = () => {
    return (
        <>
            <noscript>
                <iframe
                    src="https://www.googletagmanager.com/ns.html?id=GTM-K9JCT38"
                    height="0"
                    width="0"
                    style={{ display: 'none', visibility: 'hidden' }}
                ></iframe>
            </noscript>
            <div className="flex flex-col h-screen bg-stone-200 z-0 overflow-hidden">
                <Head>
                    <title className="text-eth-gray">The Merge Canvas</title>
                    <meta
                        name="description"
                        content="Own a Piece of Blockchain History By Contributing to this Hybrid NFT! Made with love by OutlierDAO"
                    />
                    <link rel="icon" href="/favicon.ico" />
                </Head>
                <BrowserCheck />
                <Header>
                    <nav className="w-full">
                        <div className="flex flex-row width-clamp justify-between items-center">
                            <div className="flex space-x-4 items-center">
                                <div>
                                    <img
                                        src="https://merge-nft.s3.us-west-2.amazonaws.com/canvas.png"
                                        alt=""
                                        className="h-8 w-8"
                                    />
                                </div>
                                <div className="text-2xl font-bold text-eth-gray">
                                    The Merge Canvas
                                </div>
                            </div>
                            <div className="text-lg">
                                <ConnectButton
                                    // chainStatus="none"
                                    showBalance={false}
                                    chainStatus="icon"
                                    // accountStatus="address"
                                />
                            </div>
                        </div>
                    </nav>
                </Header>
                <main className="flex-grow width-clamp">
                    <PixelCanvasContextProvider>
                        <Board />
                    </PixelCanvasContextProvider>
                    {/*<DisplayNameComp />*/}
                </main>
                {/* <Footer>
                <div className="text-eth-gray">
                    The Merge Canvas built with ❤️ by{' '}
                    <a href="https://twitter.com/outlierdao">Outliers</a>
                </div>
            </Footer> */}
            </div>
        </>
    );
};

export default Home;
