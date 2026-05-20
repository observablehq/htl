// @vitest-environment jsdom
import {html} from "../src/index.js";
import {assert, it} from "vitest";

it("interpolating into a tag name is not allowed", () => {
  assert.throws(() => html`<${"button"}>Does this work?</>`, "tag name cannot be interpolated");
  assert.throws(() => html`<script></scr${"ipt  >"}</script>`, "tag name cannot be interpolated");
});

it("interpolating into a greater-than sign into attributes is not allowed", () => {
  assert.throws(() => html`<input ${"checked>"}>`, "interpolated attribute name contains bare '>'");
  assert.throws(() => html`<input ${"size=<whatever>"}>`, "interpolated attribute name contains bare '>'");
});
