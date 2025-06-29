import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/modules/**/*.{js,ts,jsx,tsx,mdx}',
    './src/shared/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // LiveKit Dashboard Design System Colors
        background: {
          primary: '#0a0a0a',
          secondary: '#1a1a1a',
          tertiary: '#2a2a2a',
          card: '#1e1e1e',
          hover: '#2d2d2d',
        },
        text: {
          primary: '#ffffff',
          secondary: '#a0a0a0',
          muted: '#666666',
          disabled: '#404040',
        },
        accent: {
          primary: '#00d4ff',
          secondary: '#0099cc',
          success: '#00ff88',
          warning: '#ffaa00',
          error: '#ff4444',
        },
        border: {
          subtle: '#333333',
          medium: '#444444',
          strong: '#555555',
        },
        // Legacy colors for backward compatibility
        primary: {
          green: '#00ff88',
          'green-hover': '#00cc6a',
          'green-light': '#1a4d3a',
        },
        secondary: {
          orange: '#ffaa00',
          'orange-light': '#4d3d1a',
        },
        neutral: {
          white: '#ffffff',
          'light-gray': '#2a2a2a',
          'medium-gray': '#444444',
          'dark-gray': '#a0a0a0',
          charcoal: '#666666',
          black: '#0a0a0a',
        },
      },
      fontFamily: {
        primary: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        secondary: ['SF Mono', 'Monaco', 'Cascadia Code', 'monospace'],
      },
      fontSize: {
        'xs': '0.75rem',
        'sm': '0.875rem',
        'base': '1rem',
        'lg': '1.125rem',
        'xl': '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
      },
      spacing: {
        'xs': '0.25rem',
        'sm': '0.5rem',
        'md': '0.75rem',
        'lg': '1rem',
        'xl': '1.25rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
        '4xl': '2.5rem',
        '5xl': '3rem',
      },
      borderRadius: {
        'sm': '0.125rem',
        'md': '0.375rem',
        'lg': '0.5rem',
        'xl': '0.75rem',
      },
      boxShadow: {
        'subtle': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'medium': '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        'large': '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        'glow': '0 0 20px rgba(0, 212, 255, 0.3)',
      },
    },
  },
  plugins: [],
}

export default config 