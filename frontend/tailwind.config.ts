import type { Config } from "tailwindcss";

const defaultTheme = require("tailwindcss/defaultTheme");
 
const colors = require("tailwindcss/colors");
const {
  default: flattenColorPalette,
} = require("tailwindcss/lib/util/flattenColorPalette");

const config: Config = {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
        "./frontend/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#00C261',
                primaryHover: '#009E4F',
                secondary: '#005155',
                black: '#444444',
                background: '#F1F5F9',
                'light-grey': '#A5A5A5',
                'lightest-grey': '#D9D9D9',
                'tag-grey': '#ECECEC',
            },
            fontFamily: {
                poppins: ['Poppins', 'sans-serif']
            },
            fontSize: {
                'heading': '38px',
            },
            boxShadow: {
                'default': '0px 5px 15px 8px rgba(0, 0, 0, 0.05)',
            },
            animation: {
                scroll:
                  "scroll var(--animation-duration, infinite) var(--animation-direction, forwards) linear infinite",
                horizontalScroll:
                  "horizontalScroll var(--animation-duration, infinite) var(--animation-direction, forwards) linear infinite",
            },
            keyframes: {
                scroll: {
                    to: {
                        transform: "translateY(calc(-100% - 0.5rem))",
                    },
                },
                horizontalScroll: {
                    to: {
                        transform: "translate(calc(-50% - 0.5rem))",
                    },
                },
            },
        },
    },
    plugins: [addVariablesForColors],
};

function addVariablesForColors({ addBase, theme }: any) {
    let allColors = flattenColorPalette(theme("colors"));
    let newVars = Object.fromEntries(
        Object.entries(allColors).map(([key, val]) => [`--${key}`, val])
    );
   
    addBase({
        ":root": newVars,
    });
  }

export default config