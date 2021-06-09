import {readFileSync} from "fs";
import json from "@rollup/plugin-json";
import {terser} from "rollup-plugin-terser";
import * as meta from "./package.json";

// Extract copyrights from the LICENSE.
const copyright = readFileSync("./LICENSE", "utf-8")
  .split(/\n/g)
  .filter(line => /^Copyright\s+/.test(line))
  .map(line => line.replace(/^Copyright\s+/, ""))
  .join(", ");

const config = {
  input: "bundle.js",
  output: {
    file: `dist/${meta.name}.js`,
    name: "htl",
    format: "umd",
    indent: false,
    extend: false,
    banner: `// ${meta.homepage} v${meta.version} Copyright ${copyright}`
  },
  plugins: [
    json()
  ]
};

export default [
  config,
  {
    ...config,
    output: {
      ...config.output,
      file: `dist/${meta.name}.min.js`
    },
    plugins: [
      ...config.plugins,
      terser({
        output: {
          preamble: config.output.banner
        }
      })
    ]
  }
];
