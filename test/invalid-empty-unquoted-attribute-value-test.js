import {html} from "htl";
import tape from "./jsdom.js";

tape("interpolating an empty string with a suffix is not allowed", test => {
  test.throws(() => html`<button value=${""}red>`, Error);
  test.throws(() => html`<button value=${""}${"red"}>`, Error);
  test.throws(() => html`<button value=${""}${true}>`, Error);
  test.throws(() => html`<button value=${""}${false}>`, Error);
});
