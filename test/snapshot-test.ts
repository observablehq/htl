import assert from "assert";
import {promises as fs} from "fs";
import {resolve, basename} from "path";
import beautify from "js-beautify";
// @ts-ignore
import he from "he";
import it from "./jsdom.js";
import * as snapshots from "./snapshots.js";

(async () => {
  await fs.mkdir("./test/snapshots", {recursive: true});
  for (const [name, snapshot] of Object.entries(snapshots)) {
    it(`htl ${name}`, async () => {
      const node = await snapshot();
      const actual = node === null ? ""
        : node.nodeType === 3 ? he.encode(node.textContent)
        // @ts-ignore
        : beautify.html(node.outerHTML, {indent_size: 2});
      const outfile = resolve("./test/snapshots", `${basename(name, ".js")}.html`); // TODO or .svg
      let expected;

      try {
        expected = await fs.readFile(outfile, "utf8");
      } catch (error) {
        // @ts-ignore
        if (error.code === "ENOENT" && process.env.CI !== "true") {
          console.warn(`! generating ${outfile}`);
          await fs.writeFile(outfile, actual, "utf8");
          return;
        } else {
          throw error;
        }
      }

      assert(actual === expected, `${name} must match snapshot
<<< ACTUAL
${actual}
===
${expected}
>>> EXPECTED
`);
    });
  }
})();
