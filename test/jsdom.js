import {JSDOM} from "jsdom";
import tape from "tape-await";

export default function(description, run) {
  return tape(description, async test => {
    try {
      const window = new JSDOM("").window;
      global.document = window.document;
      global.Node = window.Node;
      global.NodeList = window.NodeList;
      global.HTMLCollection = window.HTMLCollection;
      return await run(test);
    } finally {
      delete global.document;
      delete global.Node;
      delete global.NodeList;
      delete global.HTMLCollection;
    }
  });
}
