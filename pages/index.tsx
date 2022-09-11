import type { NextPage } from 'next';
import { LaunchButton } from '../components/Inputs/LaunchAppButton';

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
                <div className="flex flex-col justify-center items-center">
                    <div className="border-4 bg-black border-black text-7xl font-bold text-white mar">
                        The Merge Mosaic
                    </div>
                    <div className="border-4 bg-black border-black text-5xl font-bold text-white mar">
                        A Collective Canvas for the ETH Merge
                    </div>
                    <div className="border-4 bg-black border-black text-3xl font-bold text-white mar">
                        Merge? #LGTM!
                    </div>
                </div>
                <div className="pt-6">
                    <LaunchButton />
                </div>
            </div>
        </div>
    );
}

const Intro: NextPage = () => {
    function description() {
        return (
            <div className="flex flex-col justify-center h-screen w-full items-center">
                <div className="flex flex-col gap-y-10 w-1/2 pt-4">
                    <div className="text-3xl font-bold text-black mar">
                        Own a Piece of Blockchain History By Contributing to
                        This Hybrid NFT
                    </div>
                    <div className="text-3xl font-bold text-black mar">
                        Users Can Draw on the Canvas in ETH 1.0 Up to the Merge
                        Moment. You Can Mint an NFT of the Pixels you have
                        contibted to the Mosaic as Soon as the Merge Happens and
                        Be and Become One of the Firsts to an NFT on ETH 2.0
                    </div>

                    <div className="text-3xl font-bold text-black mar">
                        Users Can Draw on the Canvas in ETH 1.0 Up to the Merge
                        Moment. You Can Mint an NFT of the Pixels you have
                        contibted to the Mosaic as Soon as the Merge Happens and
                        Be and Become One of the Firsts to an NFT on ETH 2.0
                    </div>

                    <div className="text-3xl font-bold text-black mar">
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
