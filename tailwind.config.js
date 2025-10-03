// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export const darkMode = [ 'class' , 'dark-theme' ];
export const content = [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
];
export const theme = {
    extend: {
        
    },
};
export const plugins = [];