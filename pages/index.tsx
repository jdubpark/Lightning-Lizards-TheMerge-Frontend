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
            <div className="text-2xl md:text-4xl font-bold max-w-[1000px]">
                Be a part of the historic Ethereum merge with your on-chain
                pixel of Mosaic! 🦄
                <br />
                <br />
                Draw on the Mosaic Canvas up to the Merge TTD, when your pixels
                become permanent. Be the last one to write into the old Ethereum
                state!
                <br />
                <br />
                Win a pixel before the Merge by painting over others or bidding
                ETH to show your zeal! Minimum bid is 0.001 ETH and the new bid
                amount is sent to the previous owner. So you earn money if you
                lose your beloved pixels! Get in early!
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
                        You can draw on someone else`&apos;`s pixel - pay them
                        and overwrite their work (minimum bid is 0.001ETH) 😛
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
                        P.S: We’ve optimized the code so much so it won&apos;t
                        cost you more than a couple of bucks to edit pixels 💸
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
            </div>
        </div>
    );
};

function Footer({ children }: { children: JSX.Element | JSX.Element[] }) {
    return <footer className="p-4 bg-stone-100 text-center">{children}</footer>;
}

const Home: NextPage = () => {
    return (
        <>
            <div>
                <Head>
                    <title>The Merge Mosaic</title>
                    <meta
                        name="description"
                        content="Own a Piece of Blockchain History By Contributing to this Hybrid NFT! Made with love by OutlierDAO"
                    />
                    <meta name="twitter:card" content="summary_large_image" />
                    {/* <meta
                        name="twitter:site"
                        content="@YOUR_TWITTER_USERNAME"
                    /> */}
                    <meta name="twitter:title" content="The Merge Canvas" />
                    <meta
                        name="twitter:description"
                        content="The Merge Canvas -  Own a Piece of Blockchain History By Contributing to this Hybrid NFT"
                    />
                    <meta
                        name="twitter:image"
                        content="https://merge-nft.s3.us-west-2.amazonaws.com/card.png"
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
