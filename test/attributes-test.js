import assert from "assert";
import {html, svg} from "../src/index.js";
import it from "./jsdom.js";

const NS_XLINK = "http://www.w3.org/1999/xlink";
const NS_XMLNS = "http://www.w3.org/2000/xmlns/";

it("HTML attributes are implicitly lowercased", () => {
  assert.deepStrictEqual(localAttr(html`<span ${{theThing: "foo"}}>`.attributes[0]), ["thething", "foo"]);
});

it("SVG attributes are implicitly case-corrected", () => {
  assert.deepStrictEqual(localAttr(svg`<svg ${{attributename: "foo"}}>`.attributes[0]), ["attributeName", "foo"]);
  assert.deepStrictEqual(localAttr(svg`<svg ${{unKnOWn: "foo"}}>`.attributes[0]), ["unknown", "foo"]);
});

it("SVG foreign attributes are implicitly namespaced", () => {
  assert.deepStrictEqual(foreignAttr(svg`<svg ${{"xlink:title": "foo"}}>`.attributes[0]), [NS_XLINK, "xlink", "title", "foo"]);
  assert.deepStrictEqual(foreignAttr(svg`<svg ${{"xliNk:TitLe": "foo"}}>`.attributes[0]), [NS_XLINK, "xlink", "title", "foo"]);
  assert.deepStrictEqual(foreignAttr(svg`<svg ${{xmlns: "foo"}}>`.attributes[0]), [NS_XMLNS, null, "xmlns", "foo"]);
  assert.deepStrictEqual(foreignAttr(svg`<svg ${{xmLNS: "foo"}}>`.attributes[0]), [NS_XMLNS, null, "xmlns", "foo"]);
});

it("unknown SVG foreign attributes are not implicitly namespaced", () => {
  assert.deepStrictEqual(foreignAttr(svg`<svg ${{"xlink:foo": "bar"}}>`.attributes[0]), [null, null, "xlink:foo", "bar"]);
});

function localAttr({name, value}) {
  return [name, value];
}

function foreignAttr({namespaceURI, prefix, localName, value}) {
  return [namespaceURI, prefix, localName, value];
}
