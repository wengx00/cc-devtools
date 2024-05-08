import { defineConfig } from "vite";
import viteDts from "vite-plugin-dts";

export default defineConfig({
  plugins: [viteDts()],
  build: {
    lib: {
      entry: "./lib/index.ts",
      name: "entry",
      fileName: "entry",
    },
  },
});
