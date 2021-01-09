import {promises as fs} from "fs";
import * as path from "path";
import {html as beautify} from "js-beautify";
import {encode} from "he";
import tape from "./jsdom.js";
import * as snapshots from "./snapshots.js";

(async () => {
  for (const [name, snapshot] of Object.entries(snapshots)) {
    tape(`htl ${name}`, async test => {
      const node = await snapshot(test);
      const actual = node === null ? ""
        : node.nodeType === 3 ? encode(node.textContent)
        : beautify(node.outerHTML, {indent_size: 2});
      const outfile = path.resolve("./test/snapshots", `${path.basename(name, ".js")}.html`); // TODO or .svg
      let expected;

      try {
        expected = await fs.readFile(outfile, "utf8");
      } catch (error) {
        if (error.code === "ENOENT" && process.env.CI !== "true") {
          console.warn(`! generating ${outfile}`);
          await fs.writeFile(outfile, actual, "utf8");
          return;
        } else {
          throw error;
        }
      }

      test.ok(actual === expected, `${name} must match snapshot
<<< ACTUAL
${actual}
===
${expected}
>>> EXPECTED
`);
    });
  }
})();
