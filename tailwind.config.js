module.exports = {
  content: {
    relative: true,
    files: [
      './.nuxt/**/*.{html,js,vue}',
      './node_modules/@nuxt/**/*.{html,js,vue}',
      './pages/**/*.{html,js,vue}',
      './components/**/*.{html,js,vue}',
      './layouts/**/*.{html,js,vue}',
    ],
  },
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    require('daisyui'), // ordering is important
    // require('flowbite/plugin'),
    // require('tw-elements/dist/plugin'),
  ],
  daisyui: {
    themes: [
      {
        mytheme: {
          "primary":   "#38bdf8",
          "secondary": "#f87171",
          "accent":    "#a3e635",
          "neutral":   "#4b5563",
          "base-100":  "#FFFFFF",
          "info":      "#3ABFF8",
          "success":   "#a3e635",
          "warning":   "#FBBD23",
          "error":     "#F87272",
        },
      },
      "light", // first one will be the default theme
    ],
  },
}
