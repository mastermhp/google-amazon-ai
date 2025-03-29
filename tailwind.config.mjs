// // tailwind.config.mjs
// import { defineConfig } from 'tailwindcss';

// export default defineConfig({
//   content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
//   theme: {
//     extend: {
//       colors: {
//         border: "#e5e7eb",
//       },
//     },
//   },
//   plugins: [],
// });


// /** @type {import('tailwindcss').Config} */
// module.exports = {
//     darkMode: ["class"],
//     content: [
//       "./pages/**/*.{js,jsx}",
//       "./components/**/*.{js,jsx}",
//       "./app/**/*.{js,jsx}",
//       "./src/**/*.{js,jsx}",
//       "*.{js,jsx,mdx}",
//       "*.{js,ts,jsx,tsx,mdx}",
//     ],
//     theme: {
//       container: {
//         center: true,
//         padding: "2rem",
//         screens: {
//           "2xl": "1400px",
//         },
//       },
//       extend: {
//         colors: {
//           border: "hsl(var(--border))",
//           input: "hsl(var(--input))",
//           ring: "hsl(var(--ring))",
//           background: "hsl(var(--background))",
//           foreground: "hsl(var(--foreground))",
//           primary: {
//             DEFAULT: "hsl(var(--primary))",
//             foreground: "hsl(var(--primary-foreground))",
//           },
//           secondary: {
//             DEFAULT: "hsl(var(--secondary))",
//             foreground: "hsl(var(--secondary-foreground))",
//           },
//           destructive: {
//             DEFAULT: "hsl(var(--destructive))",
//             foreground: "hsl(var(--destructive-foreground))",
//           },
//           muted: {
//             DEFAULT: "hsl(var(--muted))",
//             foreground: "hsl(var(--muted-foreground))",
//           },
//           accent: {
//             DEFAULT: "hsl(var(--accent))",
//             foreground: "hsl(var(--accent-foreground))",
//           },
//           popover: {
//             DEFAULT: "hsl(var(--popover))",
//             foreground: "hsl(var(--popover-foreground))",
//           },
//           card: {
//             DEFAULT: "hsl(var(--card))",
//             foreground: "hsl(var(--card-foreground))",
//           },
//         },
//         borderRadius: {
//           lg: "var(--radius)",
//           md: "calc(var(--radius) - 2px)",
//           sm: "calc(var(--radius) - 4px)",
//         },
//         keyframes: {
//           "accordion-down": {
//             from: { height: 0 },
//             to: { height: "var(--radix-accordion-content-height)" },
//           },
//           "accordion-up": {
//             from: { height: "var(--radix-accordion-content-height)" },
//             to: { height: 0 },
//           },
//         },
//         animation: {
//           "accordion-down": "accordion-down 0.2s ease-out",
//           "accordion-up": "accordion-up 0.2s ease-out",
//         },
//       },
//     },
//     plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
//   }
  
  


/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./app/**/*.{js,jsx}",
    "./src/**/*.{js,jsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Neon colors
        neon: {
          blue: "hsl(var(--neon-blue))",
          purple: "hsl(var(--neon-purple))",
          pink: "hsl(var(--neon-pink))",
          cyan: "hsl(var(--neon-cyan))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
        glow: {
          "0%, 100%": {
            boxShadow: "0 0 5px rgba(59, 130, 246, 0.5), 0 0 10px rgba(59, 130, 246, 0.3)",
          },
          "50%": {
            boxShadow: "0 0 15px rgba(59, 130, 246, 0.8), 0 0 20px rgba(59, 130, 246, 0.5)",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        glow: "glow 2s ease-in-out infinite",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
}

