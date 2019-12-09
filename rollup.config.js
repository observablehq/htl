import {terser} from "rollup-plugin-terser";
import * as meta from "./package.json";

const config = {
  input: "src/index.js",
  output: {
    file: `dist/${meta.name}.js`,
    name: "htl",
    format: "umd",
    indent: false,
    extend: false,
    banner: `// ${meta.homepage} v${meta.version} Copyright ${(new Date).getFullYear()} Observable, Inc.`
  },
  plugins: []
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
