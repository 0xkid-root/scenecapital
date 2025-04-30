import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-modern': 'linear-gradient(to right, #00c6ff, #0072ff)',
        'gradient-purple': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'gradient-teal': 'linear-gradient(135deg, #2dd4bf 0%, #0ea5e9 100%)',
        'gradient-sunset': 'linear-gradient(135deg, #f97316 0%, #db2777 100%)',
        'gradient-cosmic': 'linear-gradient(to right, #8e2de2, #4a00e0)',
        'gradient-emerald': 'linear-gradient(to right, #2af598, #009efd)',
        'gradient-fire': 'linear-gradient(to right, #f83600, #f9d423)',
        'gradient-midnight': 'linear-gradient(to right, #232526, #414345)',
        'gradient-ocean': 'linear-gradient(to right, #1cb5e0, #000851)',
        'gradient-candy': 'linear-gradient(to right, #fc466b, #3f5efb)',
        'mesh-gradient': 'radial-gradient(at 40% 20%, rgba(104, 109, 224, 0.33) 0px, transparent 50%), radial-gradient(at 80% 0%, rgba(189, 30, 89, 0.29) 0px, transparent 50%), radial-gradient(at 0% 50%, rgba(76, 0, 255, 0.22) 0px, transparent 50%), radial-gradient(at 80% 50%, rgba(60, 211, 173, 0.28) 0px, transparent 50%), radial-gradient(at 0% 100%, rgba(255, 179, 71, 0.29) 0px, transparent 50%), radial-gradient(at 80% 100%, rgba(105, 21, 248, 0.27) 0px, transparent 50%), radial-gradient(at 0% 0%, rgba(120, 255, 214, 0.24) 0px, transparent 50%)',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0',
          },
          to: {
            height: 'var(--radix-accordion-content-height)',
          },
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)',
          },
          to: {
            height: '0',
          },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'pulse-slow': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'rotate-slow': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'bounce-subtle': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        'scale-up': {
          '0%': { transform: 'scale(0.95)' },
          '100%': { transform: 'scale(1)' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in-right': {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse-slow 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 3s linear infinite',
        'rotate-slow': 'rotate-slow 8s linear infinite',
        'bounce-subtle': 'bounce-subtle 3s ease-in-out infinite',
        'scale-up': 'scale-up 0.3s ease-out',
        'fade-in-up': 'fade-in-up 0.5s ease-out',
        'fade-in-right': 'fade-in-right 0.5s ease-out',
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
        'neon': '0 0 5px theme(colors.primary.DEFAULT), 0 0 20px theme(colors.primary.DEFAULT)',
        'inner-glow': 'inset 0 0 10px rgba(255, 255, 255, 0.5)',
        'float': '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
    function({ addUtilities }: { addUtilities: Function }) {
      const newUtilities = {
        '.glass': {
          background: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(10px)',
          borderRadius: '10px',
          border: '1px solid rgba(255, 255, 255, 0.18)',
        },
        '.glass-dark': {
          background: 'rgba(17, 25, 40, 0.75)',
          backdropFilter: 'blur(10px)',
          borderRadius: '10px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        },
        '.glass-card': {
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          borderRadius: 'var(--radius)',
          border: '1px solid rgba(255, 255, 255, 0.18)',
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
        },
        '.glass-card-dark': {
          background: 'rgba(17, 25, 40, 0.5)',
          backdropFilter: 'blur(10px)',
          borderRadius: 'var(--radius)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.25)',
        },
        '.gradient-border': {
          position: 'relative',
          borderRadius: 'var(--radius)',
          '&::before': {
            content: '""',
            position: 'absolute',
            inset: '-2px',
            borderRadius: 'calc(var(--radius) + 2px)',
            background: 'linear-gradient(45deg, #3b82f6, #8b5cf6, #ec4899)',
            zIndex: '-1',
          },
        },
        '.shimmer': {
          backgroundImage: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
          backgroundSize: '200% 100%',
          animation: 'shimmer 3s linear infinite',
        },
      }
      addUtilities(newUtilities)
    },
  ],
};
export default config;
