import '../styles/globals.css';
import '../styles/custom.css';
import type { AppProps } from 'next/app';
import '@rainbow-me/rainbowkit/styles.css';
import {
    RainbowKitProvider,
    getDefaultWallets,
    Theme,
    darkTheme as rbDarkTheme,
    lightTheme as rbLightTheme,
} from '@rainbow-me/rainbowkit';
import { chain, configureChains, createClient, WagmiConfig } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';
import PlausibleProvider from 'next-plausible';

let chainsIncluded;
if (process.env.NEXT_PUBLIC_NODE_ENV === 'production') {
    chainsIncluded = [chain.mainnet];
} else {
    chainsIncluded = [chain.mainnet, chain.goerli, chain.hardhat];
}

const { chains, provider, webSocketProvider } = configureChains(
    chainsIncluded,
    [
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

const LightTheme = rbLightTheme();

const lightTheme: Theme = {
    // ...DarkTheme,
    ...LightTheme,
    colors: {
        ...LightTheme.colors,
        accentColorForeground: '#ecf0f1',
    },
    radii: {
        ...LightTheme.radii,
        connectButton: '6px',
    },
    shadows: {
        ...LightTheme.shadows,
        connectButton: 'none',
    },
};

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <>
            <PlausibleProvider domain="mergemosaic.xyz" trackLocalhost={true}>
                <WagmiConfig client={wagmiClient}>
                    <RainbowKitProvider
                        chains={chains}
                        theme={lightTheme}
                        modalSize="compact"
                        showRecentTransactions
                    >
                        <Component {...pageProps} />
                    </RainbowKitProvider>
                </WagmiConfig>
            </PlausibleProvider>
        </>
    );
}

export default MyApp;
