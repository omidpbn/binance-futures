module.exports = {
  darkMode: "class",
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./src/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}", "./node_modules/flowbite/**/*.js"],
  theme: {
    extend: {
      colors: {
        gray: {
          500: "#DDDDDD",
          600: "#BFBFBF",
          700: "#707A8A",
          800: "#ebecef",
          900: "#f5f5f5",
          950: "#333B47",
        },
        slate: {
          700:"#4F5867",
          800:"#29313D",
          900: "#181a21",
          950: "#0a0f11",
        },
        yellow: {
          900: "#FCD535",
          950: "#C99400",
        },
        green: {
          700: "#EBF8F3",
          800: "#1C2A2B",
          900: "#2EBD85",
        },
        red: {
          700: "#FFECEF",
          800: "#2F1E27",
          900: "#F6465D",
        },
      },
    },
  },
  plugins: [require("flowbite/plugin")],
};
