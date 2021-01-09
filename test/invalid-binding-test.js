import {html} from "htl";
import tape from "./jsdom.js";

tape("interpolating into a tag name is not allowed", test => {
  test.throws(() => html`<${"button"}>Does this work?</>`, Error);
});
