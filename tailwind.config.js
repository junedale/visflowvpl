/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/renderer/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        // Material Design 3 Tonal Surfaces
        surface: {
          dim: 'rgb(var(--surface-dim) / <alpha-value>)',
          DEFAULT: 'rgb(var(--surface) / <alpha-value>)',
          bright: 'rgb(var(--surface-bright) / <alpha-value>)',
          'container-lowest': 'rgb(var(--surface-container-lowest) / <alpha-value>)',
          'container-low': 'rgb(var(--surface-container-low) / <alpha-value>)',
          container: 'rgb(var(--surface-container) / <alpha-value>)',
          'container-high': 'rgb(var(--surface-container-high) / <alpha-value>)',
          'container-highest': 'rgb(var(--surface-container-highest) / <alpha-value>)',
        },
        // M3 Semantic Roles (Dark Theme Tokens)
        m3: {
          primary: 'rgb(var(--m3-primary) / <alpha-value>)',
          'on-primary': 'rgb(var(--m3-on-primary) / <alpha-value>)',
          'primary-container': 'rgb(var(--m3-primary-container) / <alpha-value>)',
          'on-primary-container': 'rgb(var(--m3-on-primary-container) / <alpha-value>)',

          secondary: 'rgb(var(--m3-secondary) / <alpha-value>)',
          'on-secondary': 'rgb(var(--m3-on-secondary) / <alpha-value>)',
          'secondary-container': 'rgb(var(--m3-secondary-container) / <alpha-value>)',
          'on-secondary-container': 'rgb(var(--m3-on-secondary-container) / <alpha-value>)',

          tertiary: 'rgb(var(--m3-tertiary) / <alpha-value>)',
          'on-tertiary': 'rgb(var(--m3-on-tertiary) / <alpha-value>)',
          'tertiary-container': 'rgb(var(--m3-tertiary-container) / <alpha-value>)',
          'on-tertiary-container': 'rgb(var(--m3-on-tertiary-container) / <alpha-value>)',

          error: 'rgb(var(--m3-error) / <alpha-value>)',
          'on-error': 'rgb(var(--m3-on-error) / <alpha-value>)',
          'error-container': 'rgb(var(--m3-error-container) / <alpha-value>)',
          'on-error-container': 'rgb(var(--m3-on-error-container) / <alpha-value>)',

          outline: 'rgb(var(--m3-outline) / <alpha-value>)',
          'outline-variant': 'rgb(var(--m3-outline-variant) / <alpha-value>)',
          'on-surface': 'rgb(var(--m3-on-surface) / <alpha-value>)',
          'on-surface-variant': 'rgb(var(--m3-on-surface-variant) / <alpha-value>)',
        },
        // VPL Data Types
        vpl: {
          flow: '#a8c7fa',
          number: '#7cd4fd',
          string: '#ffb4a9',
          boolean: '#d0bcff',
          array: '#ffd279',
          any: '#c4c6d0',
        },
      },
      borderRadius: {
        'xs': '4px',
        'sm': '8px',
        'md': '12px',
        'lg': '16px',
        'xl': '20px',
        '2xl': '24px',
        '3xl': '28px',
        'full': '9999px',
      },
      boxShadow: {
        'm3-1': '0px 1px 3px 1px rgba(0, 0, 0, 0.35), 0px 1px 2px 0px rgba(0, 0, 0, 0.45)',
        'm3-2': '0px 2px 6px 2px rgba(0, 0, 0, 0.35), 0px 1px 2px 0px rgba(0, 0, 0, 0.45)',
        'm3-3': '0px 4px 8px 3px rgba(0, 0, 0, 0.35), 0px 1px 3px 0px rgba(0, 0, 0, 0.45)',
        'm3-4': '0px 6px 10px 4px rgba(0, 0, 0, 0.35), 0px 2px 3px 0px rgba(0, 0, 0, 0.45)',
        'm3-5': '0px 8px 12px 6px rgba(0, 0, 0, 0.35), 0px 4px 4px 0px rgba(0, 0, 0, 0.45)',
      },
      fontFamily: {
        sans: ['Inter', 'Roboto', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
    },
  },
  plugins: [],
};
