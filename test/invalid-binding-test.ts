import assert from "assert";
import {html} from "../src/index.js";
import it from "./jsdom.js";

it("interpolating into a tag name is not allowed", () => {
  // @ts-ignore
  assert.throws(() => html`<${"button"}>Does this work?</>`, Error);
});
