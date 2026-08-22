import forms from '@tailwindcss/forms'
import containerQueries from '@tailwindcss/container-queries'

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "on-secondary-fixed-variant": "#623e2a",
        "background": "#fbf9f4",
        "secondary-fixed": "#ffdbca",
        "tertiary-container": "#c3a028",
        "secondary": "#7d553f",
        "on-background": "#1b1c19",
        "outline-variant": "#c5c8bd",
        "primary-fixed-dim": "#becbae",
        "tertiary": "#735c00",
        "surface-variant": "#e4e2dd",
        "outline": "#75786f",
        "on-error": "#ffffff",
        "surface-bright": "#fbf9f4",
        "on-tertiary-container": "#483800",
        "error-container": "#ffdad6",
        "inverse-surface": "#30312e",
        "primary": "#56624b",
        "on-error-container": "#93000a",
        "inverse-on-surface": "#f2f1ec",
        "surface-dim": "#dbdad5",
        "on-secondary-container": "#7a523d",
        "surface-container": "#f0eee9",
        "surface-tint": "#56624b",
        "tertiary-fixed-dim": "#e9c349",
        "on-tertiary": "#ffffff",
        "on-secondary-fixed": "#301404",
        "error": "#ba1a1a",
        "on-surface-variant": "#454840",
        "secondary-container": "#ffc9ae",
        "on-tertiary-fixed-variant": "#574500",
        "primary-fixed": "#dae7c9",
        "on-primary": "#ffffff",
        "surface-container-highest": "#e4e2dd",
        "surface-container-high": "#eae8e3",
        "surface": "#fbf9f4",
        "on-secondary": "#ffffff",
        "on-surface": "#1b1c19",
        "surface-container-low": "#f5f3ee",
        "on-tertiary-fixed": "#241a00",
        "tertiary-fixed": "#ffe088",
        "on-primary-fixed": "#141e0c",
        "inverse-primary": "#becbae",
        "on-primary-container": "#323d28",
        "on-primary-fixed-variant": "#3f4a35",
        "secondary-fixed-dim": "#f0bba0",
        "primary-container": "#9ba88d",
        "surface-container-lowest": "#ffffff"
      },
      borderRadius: {
        "DEFAULT": "0.125rem",
        "lg": "0.25rem",
        "xl": "0.5rem",
        "full": "0.75rem"
      },
      spacing: {
        "stack-md": "24px",
        "stack-sm": "12px",
        "stack-lg": "48px",
        "margin-desktop": "64px",
        "container-max": "1200px",
        "unit": "8px",
        "margin-mobile": "20px",
        "gutter": "24px"
      },
      fontFamily: {
        "body-md": ["Manrope", "sans-serif"],
        "headline-md": ["Libre Caslon Text", "serif"],
        "headline-lg": ["Libre Caslon Text", "serif"],
        "headline-lg-mobile": ["Libre Caslon Text", "serif"],
        "display-lg": ["Libre Caslon Text", "serif"],
        "label-md": ["Manrope", "sans-serif"],
        "body-lg": ["Manrope", "sans-serif"],
        "label-sm": ["Manrope", "sans-serif"]
      },
      fontSize: {
        "body-md": ["16px", { "lineHeight": "24px", "fontWeight": "400" }],
        "headline-md": ["24px", { "lineHeight": "32px", "fontWeight": "400" }],
        "headline-lg": ["32px", { "lineHeight": "40px", "fontWeight": "400" }],
        "headline-lg-mobile": ["28px", { "lineHeight": "36px", "fontWeight": "400" }],
        "display-lg": ["48px", { "lineHeight": "56px", "letterSpacing": "-0.02em", "fontWeight": "400" }],
        "label-md": ["14px", { "lineHeight": "20px", "letterSpacing": "0.05em", "fontWeight": "600" }],
        "body-lg": ["18px", { "lineHeight": "28px", "fontWeight": "400" }],
        "label-sm": ["12px", { "lineHeight": "16px", "fontWeight": "500" }]
      }
    }
  },
  plugins: [
    forms,
    containerQueries
  ],
}
