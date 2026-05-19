/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0A1A2B',
        secondary: '#12324D',
        accent: '#2A5B7F',
        electric: '#8FD7FF',
        aqua: '#C8F2FF',
        mist: '#A7BCCB',
        silver: '#D6DEE6',
        light: '#FFFFFF',
        dark: '#0A1A2B',
      },
      fontFamily: {
        sans: ['var(--font-montserrat)', 'system-ui', 'sans-serif'],
        display: ['var(--font-cinzel)', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
}
