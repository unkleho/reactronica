module.exports = {
  mode: 'jit',
  purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#5f0fd1',
        },
        secondary: {
          DEFAULT: '#0fa6d1',
        },
        grey: {
          lightest: '#999',
          lighter: '#666',
          light: '#333',
          DEFAULT: '#222',
          dark: '#111',
        },
      },
    },
    colors: {
      black: '#050505',
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
