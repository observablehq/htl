import assert from "assert";
import {html} from "../src/index.js";
import it from "./jsdom.js";

it("interpolating a value with an appropriate end tag into raw text is not allowed", () => {
  // @ts-ignore
  assert.throws(() => html`<script>${"</script>"}</script>`, Error);
  // @ts-ignore
  assert.throws(() => html`<script>${"</scr"}${"ipt  >"}</script>`, Error);
  // @ts-ignore
  assert.throws(() => html`<script></scr${"ipt  >"}</script>`, Error);
  // @ts-ignore
  assert.throws(() => html`<script>${"</script foo>"}</script>`, Error);
  // @ts-ignore
  assert.throws(() => html`<style>${"</style>"}</style>`, Error);
  // @ts-ignore
  assert.throws(() => html`<style>${"</style foo>"}</style>`, Error);
});
