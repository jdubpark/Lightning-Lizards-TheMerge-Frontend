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
            <br />
            <Link href="/canvas">
                <a
                    className={clsx(
                        'mt-19 py-4 px-6 w-fit bg-eth-gray/90 text-white text-xl font-bold rounded-xl shadow transition cursor-pointer',
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
                Be a part of the historic Ethereum merge with your on-chain
                pixel of Mosaic! 🦄
                <br />
                <br />
                Draw on the Mosaic up to the Merge TTD, when your pixels become
                permanent in the old chain, you will be one of the last ones to
                write into the old chain!
                <br />
                <br />
                Win a pixel before the Merge by painting over others or bidding
                ETH to show your zeal!
                <br />
                <br />
                Unleash your artsy inner self and mint an NFT of your Mosaic
                pixels! Be the first ETH-ers to have an NFT on ETH 2.0 that
                represents the history.
                <br />
                <br />
                Showcase your community spirit, support the ETH, and own a proof
                you were part of the historical moment of ETH Merge!
                <br />
                <br />
                PS: Pixels are free for grab and you can gain ETH from the next
                person bidding 😉
                <br />
                #LGTM - Let’s get the merge
                <br />
                <br />
                <br />
                <h3 className="text-eth-gold">
                    How on earth does this even work?
                </h3>
                <br />
                <div className="[&>*]:mb-6">
                    <p> We give you a large canvas</p>
                    <p> Connect your wallet 🦊</p>
                    <p>
                        Choose upto 500 pixels anywhere on the canvas for free
                    </p>

                    <p>
                        You can draw on someone else’s pixel - pay them and
                        overwrite their work (minimum bid is 0.001ETH) 😛
                    </p>

                    <p>
                        Post the merge you would get a fully on chain NFT on ETH
                        2.0 of the art you made on the canvas making you one of
                        the first people to have an NFT on ETH 2.0
                    </p>
                    <p>
                        Get your community together and draw out what you stand
                        for. Go crazy 🤪
                    </p>
                    <p>
                        P.S: We’ve optimized the code so much so it won't cost
                        you more than a couple of bucks to edit pixels 💸
                    </p>
                </div>
                <br />
                <h3 className=" text-eth-gold">Who tf are we?</h3>
                <br />
                OutlierDAO is a community of student builders passionate about
                web3. Our mission is to connect, educate and empower the top
                web3 builders of the world who would offer open,
                censorship-resistant, and sustainable tech for the future. The
                DAO is mentored and backed by thought leaders from Floodgate and
                Standard Crypto.
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
                    <title>The Merge Mosaic</title>
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
