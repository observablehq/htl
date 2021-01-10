import {html, svg} from "htl";
import tape from "./jsdom.js";

const NS_XLINK = "http://www.w3.org/1999/xlink";
const NS_XMLNS = "http://www.w3.org/2000/xmlns/";

tape("HTML attributes are implicitly lowercased", test => {
  test.deepEquals(localAttr(html`<span ${{theThing: "foo"}}>`.attributes[0]), ["thething", "foo"]);
});

tape("SVG attributes are implicitly case-corrected", test => {
  test.deepEquals(localAttr(svg`<svg ${{attributename: "foo"}}>`.attributes[0]), ["attributeName", "foo"]);
  test.deepEquals(localAttr(svg`<svg ${{unKnOWn: "foo"}}>`.attributes[0]), ["unknown", "foo"]);
});

tape("SVG foreign attributes are implicitly namespaced", test => {
  test.deepEquals(foreignAttr(svg`<svg ${{"xlink:title": "foo"}}>`.attributes[0]), [NS_XLINK, "xlink", "title", "foo"]);
  test.deepEquals(foreignAttr(svg`<svg ${{"xliNk:TitLe": "foo"}}>`.attributes[0]), [NS_XLINK, "xlink", "title", "foo"]);
  test.deepEquals(foreignAttr(svg`<svg ${{xmlns: "foo"}}>`.attributes[0]), [NS_XMLNS, null, "xmlns", "foo"]);
  test.deepEquals(foreignAttr(svg`<svg ${{xmLNS: "foo"}}>`.attributes[0]), [NS_XMLNS, null, "xmlns", "foo"]);
});

tape("unknown SVG foreign attributes are not implicitly namespaced", test => {
  test.deepEquals(foreignAttr(svg`<svg ${{"xlink:foo": "bar"}}>`.attributes[0]), [null, null, "xlink:foo", "bar"]);
});

function localAttr({name, value}) {
  return [name, value];
}

function foreignAttr({namespaceURI, prefix, localName, value}) {
  return [namespaceURI, prefix, localName, value];
}
