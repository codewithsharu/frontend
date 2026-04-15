/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",  
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        "rabit-red":"#ea2e0e",
        "lv-gold": "#C4A265",
        "lv-cream": "#FAF7F2",
        "lv-dark": "#1A1A1A",
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
}

