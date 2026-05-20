// @vitest-environment jsdom
import {html, svg} from "../src/index.js";
import {assert, it} from "vitest";

it("interpolating a value with an appropriate end tag into raw text is not allowed", () => {
  assert.throws(() => html`<script>${"</script>"}</script>`, /cannot interpolate <\/script> into <script>/);
  assert.throws(() => html`<script>${"</scr"}${"ipt  >"}</script>`, /cannot interpolate <\/script> into <script>/);
  assert.throws(() => html`<script></scr${"ipt  >"}</script>`, /invalid binding/); // TODO
  assert.throws(() => html`<script>${"</script foo>"}</script>`, /cannot interpolate <\/script> into <script>/);
  assert.throws(() => html`<style>${"</style>"}</style>`, /cannot interpolate <\/style> into <style>/);
  assert.throws(() => html`<style>${"</style foo>"}</style>`, /cannot interpolate <\/style> into <style>/);
});
