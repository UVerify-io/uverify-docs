/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    'theme.config.jsx',
    './pages/**/*.{js,jsx,ts,tsx,md,mdx}',
    './components/**/*.{js,jsx,ts,tsx,md,mdx}',

    // Or if using `src` directory:
    './src/**/*.{js,jsx,ts,tsx,md,mdx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
