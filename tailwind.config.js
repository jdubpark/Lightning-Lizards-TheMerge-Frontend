/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx}',
        './components/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
        extend: {
            fontFamily: {
                inter: ['Inter'],
                bitter: ['Bitter'],
                opensans: ['OpenSans'],
            },
            colors: {
                'eth-light-gray': '#ecf0f1',
                'eth-gold': '#c99d66',
                'eth-gray': '#3c3c3d',
            },
            margin: {
                xSmallXOffset: 'var(--xsmall-margin-x-offset)',
                smallXOffset: 'var(--small-margin-x-offset)',
                xOffset: 'var(--margin-x-offset)',
            },
        },
    },
    plugins: [],
};
