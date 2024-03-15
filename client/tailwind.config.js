/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}


// /** @type {import('tailwindcss').Config} */
// export default {
//   content: [
//     "./index.html",
//     "./src/**/*.{js,ts,jsx,tsx}",
//     "./node_modules/@mui/**/*.{js,ts,jsx,tsx}",
//   ],
//   theme: {
//     extend: {
//       fontSize: {
//         "2xs": ["0.75rem", { lineHeight: "0.9rem" }], //12px
//         xs: ["0.875rem", { lineHeight: "1.05rem" }], //14px
//         md: ["1.125rem", { lineHeight: "21.6px" }], //18px
//         lg: [
//           "1.25rem",
//           { lineHeight: "24px", letterSpacing: "-0.003em" },
//         ], //20px
//       },
//     },
//   },
//   darkMode: "class",
// };
