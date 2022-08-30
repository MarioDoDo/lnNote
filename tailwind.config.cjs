const config = {
    mode: "jit",
    purge: [
        "./src/**/*.{html,js,svelte,ts}",
    ],
    theme: {
        extend: {
            colors: {
                "bitcoin": "#f7931a",
                "base": "#1f1f1f",
                "baseText": "#ffffffbb",
            },
            gridRowStart: {
                "7": "7",
                '8': '8',
                '9': '9',
                '10': '10',
                '11': '11',
                '12': '12',
                '13': '13',
                '14': '14',
            },
            gridRow: {
                'span-7': 'span 7 / span 7',
                'span-8': 'span 8 / span 8',
                'span-9': 'span 9 / span 9',
                'span-10': 'span 10 / span 10',
                'span-11': 'span 11 / span 11',
                'span-12': 'span 12 / span 12',
                'span-13': 'span 13 / span 13',
                'span-14': 'span 14 / span 14',
            },
            gridTemplateRows: {
                '7': 'repeat(7, minmax(0, 1fr))',
                '8': 'repeat(8, minmax(0, 1fr))',
                '9': 'repeat(9, minmax(0, 1fr))',
                '10': 'repeat(10, minmax(0, 1fr))',
                '11': 'repeat(11, minmax(0, 1fr))',
                '12': 'repeat(12, minmax(0, 1fr))',
                '13': 'repeat(13, minmax(0, 1fr))',
                '14': 'repeat(14, minmax(0, 1fr))',
            },
            keyframes: {
                levitate: {
                    '0%, 100%': {
                        transform: 'translatey(-6px)'
                    },
                    '50%': {
                        transform: 'translatey(6px)'
                    },
                }
            },
            animation: {
                levitate: 'levitate 2s ease-in-out infinite',
            }
        },
    },
    plugins: [],
};

module.exports = config;
