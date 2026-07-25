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
          DEFAULT: '#0F5257', // deep teal — nav, headings, primary buttons
          dark: '#0A3B3F',
          light: '#E4EFEE',
        },
        secondary: '#8FB9A8', // sage — supporting accents, hover states
        accent: '#D9A441',    // warm gold — CTAs, highlights, sparingly
        cream: '#F7FAF6',     // page background
        ink: '#1A2E2E',       // body text
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
