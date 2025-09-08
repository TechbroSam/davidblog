// postcss.config.mjs

const config = {
  plugins: [
    "@tailwindcss/postcss",
    require('@tailwindcss/typography'), // Add the typography plugin to the same array
  ],
};

export default config;