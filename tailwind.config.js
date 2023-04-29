/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  darkMode: "class",

  theme: {
    extend: {
      colors: {
        myPurple: "#635FC7",
        myLavender: "#A8A4FF",
        myBlack: "#000112",
        myGray: {
          darkest: "#20212C",
          darker: "#2B2C37",
          dark: "#3E3F4E",
          medium: "#828FA3",
          light: "#E4EBFA",
          lightest: "#F4F7FD",
        },
        myWhite: "#FFFFFF",
        myRed: {
          darkest: "#EA5555",
          darker: "#FF9898",
        },
      },
    },
  },
  plugins: [
    // ...
  ],
};
