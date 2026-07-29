/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Design tokens for Twin Care Hospital — swap these once real
        // brand colors come in, everything else pulls from here.
        primary: {
          DEFAULT: '#0544AB', // deep blue — nav, headings, primary buttons
          dark: '#052D77',
          light: '#E8F0FF',
        },
        secondary: '#10B981', // emerald green — supporting accents, hover states
        accent: '#E63946',    // red — CTAs, highlights, sparingly
        cream: '#F7FAF6',     // page background
        ink: '#1A2E2E',       // body text
        border: '#E7E7E5',    // component borders
      },
      fontFamily: {
        display: ['"Newsreader"', 'serif'],   // headings
        body: ['"Inter"', 'sans-serif'],        // paragraphs, UI text
        mono: ['"Space Mono"', 'monospace'],  // labels, hours, directory codes
      },
    },
  },
  plugins: [],
}
