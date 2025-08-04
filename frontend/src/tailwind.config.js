/** @type {import('tailwindcss').Config} */
export const content = [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
];
export const theme = {
    extend: {
        animation: {
            fadeIn: 'fadeIn 0.6s ease-in-out',
            slideUp: 'slideUp 0.6s ease-out',
            slideDown: 'slideDown 0.6s ease-out',
            bounceFast: 'bounce 1s infinite',
            pulseSlow: 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        },
        keyframes: {
            fadeIn: {
                '0%': { opacity: 0 },
                '100%': { opacity: 1 },
            },
            slideUp: {
                '0%': { transform: 'translateY(30px)', opacity: 0 },
                '100%': { transform: 'translateY(0)', opacity: 1 },
            },
            slideDown: {
                '0%': { transform: 'translateY(-20px)', opacity: 0 },
                '100%': { transform: 'translateY(0)', opacity: 1 },
            }
        },
    },
};
export const plugins = [];