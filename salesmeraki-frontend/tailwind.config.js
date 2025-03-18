/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary Colors
        primary: {
          DEFAULT: '#6366F1', // Indigo/Purple
          dark: '#4F46E5',    // Darker Indigo
          light: '#818CF8',   // Lighter Indigo
        },
        // Secondary Colors
        secondary: {
          purple: '#A855F7',  // Purple accent
          pink: '#EC4899',    // Pink accent
        },
        // Gradient Colors for backgrounds
        gradient: {
          start: '#6366F1',   // Indigo
          mid: '#A855F7',     // Purple
          end: '#EC4899',     // Pink
        },
        // Background & Neutral Colors
        background: {
          light: '#F9FAFB',   // Light background
          dark: '#111827',    // Dark background
        },
        // Text Colors
        text: {
          primary: '#111827', // Dark text
          secondary: '#6B7280', // Gray text
          light: '#F9FAFB',   // Light text
        },
        // Keep existing scales for compatibility
        blue: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        },
      },
    },
  },
  plugins: [],
}