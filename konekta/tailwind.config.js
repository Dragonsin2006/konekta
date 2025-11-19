/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        carbon: '#0A0A0A',
        'konekta-ink': '#111111',
        'brand-pink': '#FF007A',
        'brand-purple': '#A200FF',
        'brand-cyan': '#00F5FF',
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
      },
      boxShadow: {
        'panel-glow': '0 30px 120px rgba(162, 0, 255, 0.25)',
        'btn-neon': '0 20px 45px rgba(255, 0, 122, 0.4)',
      },
      borderRadius: {
        '3xl': '1.75rem',
      },
    },
  },
  plugins: [],
};

