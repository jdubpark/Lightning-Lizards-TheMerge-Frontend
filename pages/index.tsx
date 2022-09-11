import { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { FC } from 'react';
import clsx from 'clsx';

const SplashScreen: FC = () => {
    return (
        <div className="flex flex-col justify-center items-center min-h-[95vh] bg-cover bg-[url(../public/canvas2.png)]">
            <div className="flex flex-col gap-y-5 justify-center items-center">
                <div className="flex flex-row justify-center items-center w-[300px] h-[300px] md:w-[400px] md:h-[400px] bg-[rgba(0,0,0,0.8)]">
                    <h1 className="text-7xl md:text-8xl font-bold text-white">
                        The
                        <br />
                        Merge
                        <br />
                        Mosaic
                    </h1>
                </div>
                <div className="text-center bg-[rgba(0,0,0,0.8)] w-[300px] md:w-[400px] py-3 md:text-xl text-white">
                    <h2>A Collective Canvas for the Merge</h2>
                    <h2 className="font-bold">Merge? #LGTM!</h2>
                </div>
            </div>
            <Link href="/canvas">
                <a
                    className={clsx(
                        'mt-20 py-5 px-6 w-fit bg-eth-gray/90 text-white text-xl font-bold rounded-xl shadow transition cursor-pointer',
                        'hover:bg-eth-gray hover:shadow-lg'
                    )}
                >
                    Launch App
                </a>
            </Link>
        </div>
    );
};

const InfoSection: FC = () => {
    return (
        <div className="flex flex-row justify-center py-20 mx-auto max-w-[85%]">
            <p className="text-2xl md:text-4xl font-bold max-w-[1000px]">
                Become part of the history of the blockchain when you color a
                pixel on this Mosaic
                <br />
                <br />
                You get to draw on the canvas in ETH 1.0, up to the Merge moment
                and be one of the last people who writes into the old chain
                <br />
                Then, you can mint an NFT of the pixels you own in the Mosaic as
                soon as the Merge happens and be one of the first ETH-ers to
                have an NFT on ETH 2.0
                <br />
                <br />
                Showcase your community spirit, support the ETH, and get a proof
                you were part of the historical moment of ETH Merge!
                <br />
                <br />
                PS: Pixels are free for grab and you can sell them to the next
                person 😉
            </p>
        </div>
    );
};

function Footer({ children }: { children: JSX.Element | JSX.Element[] }) {
    return <footer className="p-4 bg-stone-100 text-center">{children}</footer>;
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
            <div>
                <Head>
                    <title className="text-eth-gray">The Merge Canvas</title>
                    <meta
                        name="description"
                        content="Own a Piece of Blockchain History By Contributing to this Hybrid NFT! Made with love by OutlierDAO"
                    />
                    <link rel="icon" href="/favicon.ico" />
                </Head>
                <main className="">
                    <SplashScreen />
                    <InfoSection />
                    <Footer>
                        <div className="text-eth-gray">
                            The Merge Mosaic built with ⚡ by{' '}
                            <Link href="https://twitter.com/outlierdao">
                                <a>Outliers</a>
                            </Link>
                        </div>
                    </Footer>
                </main>
            </div>
        </>
    );
};

export default Home;
