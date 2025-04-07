/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      animation: {
        glow: "glow 2s ease-in-out infinite alternate",
      },
      keyframes: {
        glow: {
          from: {
            "box-shadow":
              "0 0 5px rgba(255, 0, 0, 0.5), 0 0 10px rgba(255, 0, 0, 0.3), 0 0 15px rgba(255, 0, 0, 0.2)",
          },
          to: {
            "box-shadow":
              "0 0 10px rgba(255, 0, 0, 0.8), 0 0 20px rgba(255, 0, 0, 0.6), 0 0 30px rgba(255, 0, 0, 0.4)",
          },
        },
      },
    },
  },
  plugins: [],
};
