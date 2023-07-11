/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      scale: {
        180: "1.80",
        200: "2.00",
        250: "2.50",

        backgroundImage: {
          "bg-gradient": "url('../../assets/images/bg-gradient.svg')",
        },
      },
    },
    plugins: [],
  },
};
