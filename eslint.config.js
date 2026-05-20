import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import {defineConfig} from "eslint/config";

export default defineConfig([
  {files: ["**/*.{js,ts,jsx,tsx}"], plugins: {js}, extends: ["js/recommended"]},
  {files: ["**/*.{js,ts,jsx,tsx}"], languageOptions: {globals: globals.browser}},
  tseslint.configs.recommended,
  {rules: {"@typescript-eslint/no-unused-expressions": "off"}}
]);
