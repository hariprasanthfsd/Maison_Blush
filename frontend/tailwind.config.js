/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        blush: {
          50: '#FAF5F3',
          100: '#F4E3DF',
          200: '#E8C4C0',
          300: '#D9A09A',
          400: '#C77D77',
          500: '#B05E58',
          600: '#8C5353',
          700: '#6E3C3D',
          800: '#52292A',
          900: '#381A1B',
        },
        rose: {
          gold: '#B8977E',
          muted: '#C49A8B',
          dusty: '#D8A79B',
        },
        cream: {
          50: '#FFFDFB',
          100: '#FAF6F0',
          200: '#F5ECE3',
          300: '#EBE0D3',
        },
        charcoal: {
          700: '#4A3E3F',
          800: '#362C2D',
          900: '#2D2325',
          DEFAULT: '#2D2325',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        script: ['"Parisienne"', '"Great Vibes"', 'cursive'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'boutique': '0 10px 30px -5px rgba(217, 160, 154, 0.15)',
        'boutique-hover': '0 20px 40px -10px rgba(140, 83, 83, 0.25)',
        'soft': '0 4px 20px rgba(0, 0, 0, 0.04)',
      }
    },
  },
  plugins: [],
}
