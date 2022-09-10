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
import Script from "next/script";

const { chains, provider, webSocketProvider } = configureChains(
    [chain.mainnet, chain.goerli, chain.hardhat],
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

const DarkTheme = rbDarkTheme();
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
            <Script
                id="google-tag-manager"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{
                    __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                })(window,document,'script','dataLayer','GTM-K9JCT38');`
                }}
            />
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
        </>
    );
}

export default MyApp;
