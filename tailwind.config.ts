import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Paleta industrial ALUCANSA
        primary: {
          50: '#f0f5fa',
          100: '#dae6f2',
          200: '#b8cfe6',
          300: '#89afd4',
          400: '#5889bd',
          500: '#3d6ca5',
          600: '#2f5489',
          700: '#284570',
          800: '#253b5e',
          900: '#192239', // Color principal oscuro
          950: '#111827',
        },
        accent: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316', // Naranja para acentos
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
        },
        industrial: {
          steel: '#64748b',
          aluminum: '#94a3b8',
          graphite: '#475569',
          slate: '#334155',
        }
      },
      fontFamily: {
        sans: ['var(--font-outfit)', 'system-ui', 'sans-serif'],
        display: ['var(--font-space-grotesk)', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-industrial': 'linear-gradient(135deg, #192239 0%, #2f5489 50%, #3d6ca5 100%)',
        'gradient-accent': 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
      },
      boxShadow: {
        'industrial': '0 4px 20px -2px rgba(25, 34, 57, 0.15)',
        'card': '0 2px 12px -2px rgba(25, 34, 57, 0.08)',
      }
    },
  },
  plugins: [],
}
export default config

