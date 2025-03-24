module.exports = {
    content: [
      './pages/**/*.{js,ts,jsx,tsx}',
      './components/**/*.{js,ts,jsx,tsx}',
      './utils/**/*.{js,ts,jsx,tsx}'
    ],
    theme: {
      extend: {
        colors: {
          'alama-primary': '#2563eb',
          'alama-secondary': '#1d4ed8'
        },
        fontFamily: {
          sans: ['Inter', 'sans-serif']
        }
      },
    },
    plugins: [],
  }