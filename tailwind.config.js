/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
    },
  },
  plugins: [require("daisyui"),],
  daisyui: {
    themes: ["light", "dark", "synthwave", "retro", "cyberpunk", {
      valentine: {
        ...require("daisyui/src/theming/themes")["[data-theme=valentine]"],
        "accent": "#000080",
      }
    }, "aqua", "forest"],
  },
}
