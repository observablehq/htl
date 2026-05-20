// @vitest-environment jsdom
import {html, svg} from "../src/index.js";
import {assert, it} from "vitest";

it("interpolating a value with an appropriate end tag into raw text is not allowed", () => {
  assert.throws(() => html`<script>${"</script>"}</script>`, Error);
  assert.throws(() => html`<script>${"</scr"}${"ipt  >"}</script>`, Error);
  assert.throws(() => html`<script></scr${"ipt  >"}</script>`, Error);
  assert.throws(() => html`<script>${"</script foo>"}</script>`, Error);
  assert.throws(() => html`<style>${"</style>"}</style>`, Error);
  assert.throws(() => html`<style>${"</style foo>"}</style>`, Error);
});
