import assert from "assert";
import {html} from "../src/index.js";
import it from "./jsdom.js";

it("interpolating an empty string with a suffix is not allowed", () => {
  // @ts-ignore
  assert.throws(() => html`<button value=${""}red>`, Error);
  // @ts-ignore
  assert.throws(() => html`<button value=${""}${"red"}>`, Error);
  // @ts-ignore
  assert.throws(() => html`<button value=${""}${true}>`, Error);
  // @ts-ignore
  assert.throws(() => html`<button value=${""}${false}>`, Error);
});
