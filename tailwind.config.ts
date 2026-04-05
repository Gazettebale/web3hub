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
        'bg-base': '#09090b',
        'bg-surface': '#111113',
        'bg-card': '#18181b',
        'border-color': '#27272a',
        'text-primary': '#fafafa',
        'text-muted': '#71717a',
        'accent-violet': '#8b5cf6',
        'accent-cyan': '#06b6d4',
        'accent-green': '#22c55e',
        'accent-orange': '#f97316',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
}

export default config
