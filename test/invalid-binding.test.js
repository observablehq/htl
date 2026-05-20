// @vitest-environment jsdom
import {html} from "../src/index.js";
import {assert, it} from "vitest";

it("interpolating into a tag name is not allowed", () => {
  assert.throws(() => html`<${"button"}>Does this work?</>`, "tag name cannot be interpolated");
  assert.throws(() => html`<script></scr${"ipt  >"}</script>`, "tag name cannot be interpolated");
});

it("interpolating attributes into a tag requires an object literal", () => {
  assert.throws(() => html`<input ${"checked"}>`, "interpolated attributes must be specified as {[name]: value} literal"); // prettier-ignore
});
