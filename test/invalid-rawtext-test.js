import {html} from "htl";
import tape from "./jsdom.js";

tape("interpolating a value with an appropriate end tag into raw text is not allowed", test => {
  test.throws(() => html`<script>${"</script>"}</script>`, Error);
  test.throws(() => html`<script>${"</script foo>"}</script>`, Error);
  test.throws(() => html`<style>${"</style>"}</style>`, Error);
  test.throws(() => html`<style>${"</style foo>"}</style>`, Error);
});
