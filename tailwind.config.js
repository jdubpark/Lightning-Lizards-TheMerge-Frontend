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
                'twitter-blue': '#1da1f2',
            },
        },
    },
    plugins: [],
};
