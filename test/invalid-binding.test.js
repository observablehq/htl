// @vitest-environment jsdom
import {html} from "../src/index.js";
import {assert, it} from "vitest";

it("interpolating an invalid tag name is not allowed", () => {
  assert.throws(() => html`<${"button>"}>Does this work?</>`, "invalid tag name: button>");
  assert.throws(() => html`<${"<button>"}>Does this work?</>`, "invalid tag name: <button>");
  assert.throws(() => html`<${"input checked"}>`, "invalid tag name: input checked");
  assert.throws(() => html`<button>hello<${"/button"}>`, "invalid tag name: /button");
  assert.throws(() => html`<button>hello</${"/button"}>`, "invalid tag name: /button");
});

it("interpolating into a partial tag name is not allowed", () => {
  assert.throws(() => html`<scr${"ipt  >"}</script>`, "cannot interpolate in state 4");
});

it("interpolating into a partial end tag name is not allowed", () => {
  assert.throws(() => html`<script></scr${"ipt  >"}</script>`, "cannot interpolate in state 29");
});

it("interpolating into a greater-than sign into attributes is not allowed", () => {
  assert.throws(() => html`<input ${"checked>"}>`, "interpolated attribute name contains bare '>'");
  assert.throws(() => html`<input ${"size=<whatever>"}>`, "interpolated attribute name contains bare '>'");
});
