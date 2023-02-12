import {JSDOM} from "jsdom";
import {it} from "mocha";

export default function jsdomit(description: any, run: any) {
  return it(description, async () => {
    try {
      const window = new JSDOM("").window;
      global.document = window.document;
      global.Node = window.Node;
      global.NodeList = window.NodeList;
      global.HTMLCollection = window.HTMLCollection;
      return await run();
    } finally {
      // @ts-ignore
      delete global.document;
      // @ts-ignore
      delete global.Node;
      // @ts-ignore
      delete global.NodeList;
      // @ts-ignore
      delete global.HTMLCollection;
    }
  });
}
