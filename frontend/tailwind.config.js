/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#4f46e5',
        'primary-dark': '#4338ca',
        'secondary': '#10b981',
        'secondary-dark': '#059669',
        'light-gray': '#f3f4f6',
        'medium-gray': '#d1d5db',
      },
    },
  },
  plugins: [],
}