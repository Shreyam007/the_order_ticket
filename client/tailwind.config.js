/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#FCF9F0',
        'surface-container-lowest': '#FFFFFF',
        'surface-container-low': '#F6F3EA',
        'surface-container': '#F1EEE5',
        'surface-container-high': '#EBE8DF',
        'on-surface': '#1C1C17',
        'on-surface-variant': '#4D4540',
        outline: '#7F756F',
        'outline-variant': '#D0C4BD',
        primary: '#15100D',
        'on-primary': '#FFFFFF',
        secondary: '#7A5900',
        'secondary-container': '#FDC74D',
        'on-secondary-container': '#725300',
        tertiary: '#001602',
        'tertiary-container': '#002E08',
        'herb-green': '#2E4F2D',
        'herb-green-light': '#3F6B3E',
        error: '#BA1A1A',
        'error-container': '#FFDAD6',
        'on-error-container': '#93000A',
        plum: '#5C3A5C',
      },
      fontFamily: {
        display: ["'Barlow Condensed'", "sans-serif"],
        body: ["'Karla'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      borderRadius: {
        'sm': '2px',
        'DEFAULT': '4px',
        'md': '6px',
        'lg': '8px',
      }
    },
  },
  plugins: [],
}
