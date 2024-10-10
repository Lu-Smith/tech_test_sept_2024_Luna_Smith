/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        customGreen: 'rgba(68, 179, 92, 0.6)',
        customGreenHover: 'rgba(102, 237, 131, 0.5)',
        customGreenLink: 'rgba(102, 237, 131, 0.9)',
      },
    },
  },
  plugins: [],
}

