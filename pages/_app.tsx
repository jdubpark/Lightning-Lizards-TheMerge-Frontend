import '../styles/globals.css';
import '../styles/custom.css';
import type { AppProps } from 'next/app';
import '@rainbow-me/rainbowkit/styles.css';
import {
    RainbowKitProvider,
    getDefaultWallets,
    Theme,
    darkTheme,
    lightTheme,
} from '@rainbow-me/rainbowkit';
import { chain, configureChains, createClient, WagmiConfig } from 'wagmi';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';

const { chains, provider, webSocketProvider } = configureChains(
    [chain.mainnet, chain.goerli, chain.hardhat],
    [
        alchemyProvider({
            // You can get your own at https://dashboard.alchemyapi.io
            alchemyId: process.env.NEXT_PUBLIC_ALCHEMY_ID || '0xkey',
        }),
        jsonRpcProvider({
            rpc: (chain) => {
                return { http: chain.rpcUrls.default };
            },
        }),
        publicProvider(),
    ]
);

const { connectors } = getDefaultWallets({
    appName: 'My RainbowKit App',
    chains,
});

const wagmiClient = createClient({
    autoConnect: true,
    connectors,
    provider,
    webSocketProvider,
});

const DarkTheme = darkTheme();
const LightTheme = lightTheme();

const myCustomTheme: Theme = {
    // ...DarkTheme,
    ...LightTheme,
    shadows: {
        ...LightTheme.shadows,
        connectButton: 'none',
    },
};

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <WagmiConfig client={wagmiClient}>
            <RainbowKitProvider
                chains={chains}
                theme={myCustomTheme}
                modalSize="compact"
                showRecentTransactions
            >
                <Component {...pageProps} />
            </RainbowKitProvider>
        </WagmiConfig>
    );
}

export default MyApp;
