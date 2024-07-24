import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      width: {
        '1/10': '10%', // Custom width utility
      },
      colors: {
        'background-dark': '#393E46',
        'background-light': '#f4f4f4',
        'text-primary': '#333',
        'text-success': '#009688',
        'text-error': '#f44336',
        'button-primary': '#4285f4',
        'button-secondary': '#EEEE', // For example, if you need to match button styles
      },
      boxShadow: {
        'light': '7px 7px 20px rgba(0, 0, 0, 0.05)',
        'default': '0 2px 4px rgba(0, 0, 0, 0.1)',
      },
      borderRadius: {
        'custom': '9px',
      },
    },
  },
  variants: {
    extend: {
      textColor: ['responsive', 'hover', 'focus'],
      backgroundColor: ['responsive', 'hover', 'focus'],
      borderColor: ['responsive', 'hover', 'focus'],
      boxShadow: ['responsive', 'hover', 'focus'],
    },
  },
};

export default config;
