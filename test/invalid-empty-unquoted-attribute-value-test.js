import assert from "assert";
import {html} from "../src/index.js";
import it from "./jsdom.js";

it("interpolating an empty string with a suffix is not allowed", () => {
  assert.throws(() => html`<button value=${""}red>`, Error);
  assert.throws(() => html`<button value=${""}${"red"}>`, Error);
  assert.throws(() => html`<button value=${""}${true}>`, Error);
  assert.throws(() => html`<button value=${""}${false}>`, Error);
});
