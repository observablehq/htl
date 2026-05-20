// @vitest-environment jsdom
import {html, svg} from "../src/index.js";
import {assert, it} from "vitest";

it("interpolating into a tag name is not allowed", () => {
  assert.throws(() => html`<${"button"}>Does this work?</>`, Error);
});
