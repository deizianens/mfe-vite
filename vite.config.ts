/// <reference types="vitest" />
/* eslint-disable @typescript-eslint/no-require-imports */
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { federation } from "@module-federation/vite";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const deps = require("./package.json").dependencies;

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    federation({
      name: "host",
      remotes: {},
      shared: {
        react: {
          singleton: true,
          requiredVersion: deps["react"],
        },
        "react-dom": {
          singleton: true,
          requiredVersion: deps["react-dom"],
        },
        "react-router-dom": {
          singleton: true,
          requiredVersion: deps["react-router-dom"],
        },
        "styled-components": {
          singleton: false,
          requiredVersion: deps["styled-components"],
        },
      },
    }),
  ],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/setupTests.ts",
    exclude: [
      "node_modules",
      "./src/setupTests.ts",
      "./src/**/*.skip.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}",
    ],
    include: ["./src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    coverage: {
      reporter: ["text", "html", "lcov"],
      exclude: ["node_modules/", "./src/setupTests.ts"],
    },
  },
});
