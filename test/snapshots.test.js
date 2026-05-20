// @vitest-environment jsdom
import {html, svg} from "../src/index.js";
import {expect, it} from "vitest";

expect.addSnapshotSerializer({
  test: (value) => value && "outerHTML" in value,
  serialize: (value) => value.outerHTML
});

expect.addSnapshotSerializer({
  test: (value) => value instanceof Text,
  serialize: (value) => {
    const span = document.createElement("span");
    span.appendChild(value);
    return span.innerHTML;
  }
});

it("staticNull", () => {
  expect(html``).toBe(null);
});

it("staticText", () => {
  expect(html`Hello, world!`).toMatchInlineSnapshot(`Hello, world!`);
});

it("staticImpliedSpan", () => {
  expect(html`Hello, <i>world</i>!`).toMatchInlineSnapshot(`<span>Hello, <i>world</i>!</span>`);
});

it("staticExplicitSpan", () => {
  expect(html`<span>Hello, <i>world</i>!</span>`).toMatchInlineSnapshot(`<span>Hello, <i>world</i>!</span>`);
});

it("escapeEntity", () => {
  expect(html`My favorite currencies are ${"dollars&pounds"}.`).toMatchInlineSnapshot(`My favorite currencies are dollars&amp;pounds.`);
});

it("escapeTags", () => {
  expect(html`Look, Ma, ${"<i>automatic escaping</i>"}!`).toMatchInlineSnapshot(`Look, Ma, &lt;i&gt;automatic escaping&lt;/i&gt;!`);
});

it("interpolatedString", () => {
  expect(html`Hello, ${"world"}!`).toMatchInlineSnapshot(`Hello, world!`);
});

it("interpolatedNumber", () => {
  expect(html`Hello, ${42}!`).toMatchInlineSnapshot(`Hello, 42!`);
});

it("interpolateIntoRawText", () => {
  expect(html`<style>p { background-image: url(${"foo.png?bar=1&baz=2"}); }</style>`).toMatchInlineSnapshot(`<style>p { background-image: url(foo.png?bar=1&baz=2); }</style>`);
});

it("interpolateIntoScript", () => {
  expect(html`<script>${"value"}</script>`).toMatchInlineSnapshot(`<script>value</script>`);
});

it("interpolateIntoRawTextWithNonmatchingEndTag", () => {
  expect(html`<script></style>${"value"}</script>`).toMatchInlineSnapshot(`<script></style>value</script>`);
});

it("escapeIntoRawText", () => {
  expect(html`<script>${"1 < 2"}</script>`).toMatchInlineSnapshot(`<script>1 < 2</script>`);
});

it("escapeNonmatchingEndTagIntoRawText", () => {
  expect(html`<script>${"</style>"}</script>`).toMatchInlineSnapshot(`<script></style></script>`);
});

it("interpolateIntoStyle", () => {
  expect(html`<style>${"value"}</style>`).toMatchInlineSnapshot(`<style>value</style>`);
});

it("interpolateIntoTextarea", () => {
  expect(html`<textarea>${"value"}</textarea>`).toMatchInlineSnapshot(`<textarea>value</textarea>`);
});

it("interpolateIntoTitle", () => {
  expect(html`<title>${"value"}</title>`).toMatchInlineSnapshot(`<title>value</title>`);
});

it("interpolatedStyleObject", () => {
  expect(html`<span style=${{background: "yellow"}}>It’s all yellow!</span>`).toMatchInlineSnapshot(`<span style="background: yellow;">It’s all yellow!</span>`);
});

it("interpolatedStyleObjectWithCustomProperty", () => {
  expect(html`<span style=${{"--custom-property": "yellow"}}>It’s all yellow!</span>`).toMatchInlineSnapshot(`<span style="--custom-property: yellow;">It’s all yellow!</span>`);
});

it("interpolatedStyleString", () => {
  expect(html`<span style="background: ${"yellow; font-style: italic"};">It’s yellow (and italic).</span>`).toMatchInlineSnapshot(`<span style="background: yellow; font-style: italic;">It’s yellow (and italic).</span>`);
});

it("interpolateIntoTag", () => {
  expect(html`<${"button"}>hello</${"button"}>`).toMatchInlineSnapshot(`<button>hello</button>`);
});

it("booleanAttribute", () => {
  expect(html`<button disabled=${true}>Can’t click me</button>`).toMatchInlineSnapshot(`<button disabled="">Can’t click me</button>`);
});

it("optionalAttribute", () => {
  expect(html`<button disabled=${null}>Can click me</button>`).toMatchInlineSnapshot(`<button>Can click me</button>`);
});

it("unquotedAttribute", () => {
  expect(html`<font color=${"red"}>`).toMatchInlineSnapshot(`<font color="red"></font>`);
});

it("trailingUnquotedAttribute", () => {
  expect(html`<font color=${"red"}${"blue"}>`).toMatchInlineSnapshot(`<font color="redblue"></font>`);
});

it("trailingBooleanAttribute", () => {
  expect(html`<font color=${true}${"blue"}>`).toMatchInlineSnapshot(`<font color="trueblue"></font>`);
});

it("escapeUnquotedAttribute", () => {
  expect(html`<font color=${'="red"'}>`).toMatchInlineSnapshot(`<font color="=&quot;red&quot;"></font>`);
});

it("emptyUnquotedAttributeSuffix", () => {
  expect(html`<button value=${""}suffix>`).toMatchInlineSnapshot(`<button value="suffix"></button>`);
});

it("emptyUnquotedAttributePrefix", () => {
  expect(html`<button value=prefix${""}>`).toMatchInlineSnapshot(`<button value="prefix"></button>`);
});

it("emptyUnquotedAttributePrefixSuffix", () => {
  expect(html`<button value=prefix${""}suffix>`).toMatchInlineSnapshot(`<button value="prefixsuffix"></button>`);
});

it("emptyUnquotedAttributeMultiple", () => {
  expect(html`<button value=${""}${""}>`).toMatchInlineSnapshot(`<button value=""></button>`);
});

it("emptyUnquotedAttributeTrueSuffix", () => {
  expect(html`<button value=${""}${true}>`).toMatchInlineSnapshot(`<button value="true"></button>`);
});

it("emptyUnquotedAttributeFalseSuffix", () => {
  expect(html`<button value=${""}${true}>`).toMatchInlineSnapshot(`<button value="true"></button>`);
});

it("emptyUnquotedAttributeTruePrefix", () => {
  expect(html`<button value=${true}${""}>`).toMatchInlineSnapshot(`<button value="true"></button>`);
});

it("emptyUnquotedAttributeFalsePrefix", () => {
  expect(html`<button value=${true}${""}>`).toMatchInlineSnapshot(`<button value="true"></button>`);
});

it("interpolatedAttributes", () => {
  expect(html`<input ${"checked"}>`).toMatchInlineSnapshot(`<input checked="">`);
});

it("interpolatedAttributesMultiple", () => {
  expect(html`<input ${`checked size=${4}`}>`).toMatchInlineSnapshot(`<input checked="" size="4">`);
});

it("interpolatedAttributesGreaterThan", () => {
  expect(html`<input ${`checked size="<whatever>"`}>`).toMatchInlineSnapshot(`<input checked="" size="<whatever>">`);
});

it("optionalText", () => {
  expect(html`There’s no ${null} here.`).toMatchInlineSnapshot(`There’s no  here.`);
});

it("unquotedEmptyString", () => {
  expect(html`<input value=${""} type="input">`).toMatchInlineSnapshot(`<input value="" type="input">`);
});

it("unquotedEmptyStringAfterPrefix", () => {
  expect(html`<input value=prefix${""} type="input">`).toMatchInlineSnapshot(`<input value="prefix" type="input">`);
});

it("interpolatedNull", () => {
  expect(html`${html``}`).toBe(null); // It’s nulls all the way down!
});

it("spreadAttributes", () => {
  expect(html`<span ${{style: {background: "yellow", fontWeight: "bold"}}}>whoa</span>`).toMatchInlineSnapshot(`<span style="background: yellow; font-weight: bold;">whoa</span>`);
});

it("interpolatedNode", () => {
  function emphasize(text) {
    return html`<i>${text}</i>`;
  }
  expect(html`This is ${emphasize("really")} important.`).toMatchInlineSnapshot(`<span>This is <i>really</i> important.</span>`);
});

it("interpolateFragment", () => {
  expect(html`<table style="width: 180px;">
  <thead><tr><th>#</th><th>Color</th><th>Swatch</th></tr></thead>
  <tbody>${["red", "green", "blue"].map((color, i) => html.fragment`<tr>
    <td>${i}</td>
    <td>${color}</td>
    <td style=${{background: color}}></td>
  </tr>`)}</tbody>
</table>`).toMatchInlineSnapshot(`
  <table style="width: 180px;">
    <thead><tr><th>#</th><th>Color</th><th>Swatch</th></tr></thead>
    <tbody><tr>
      <td>0</td>
      <td>red</td>
      <td style="background: red;"></td>
    </tr><tr>
      <td>1</td>
      <td>green</td>
      <td style="background: green;"></td>
    </tr><tr>
      <td>2</td>
      <td>blue</td>
      <td style="background: blue;"></td>
    </tr></tbody>
  </table>
`);
});

it("interpolateSet", () => {
  expect(html`It’s as easy as ${new Set([1, 2, 3])}.`).toMatchInlineSnapshot(`<span>It’s as easy as 123.</span>`);
});

it("staticSvg", () => {
  expect(svg`<svg width=60 height=60>
  <circle cx=30 cy=30 r=30></circle>
</svg>`).toMatchInlineSnapshot(`
  <svg width="60" height="60">
    <circle cx="30" cy="30" r="30"></circle>
  </svg>
`);
});

it("interpolateSvgFragment", () => {
  expect(svg`<svg width=60 height=60>
  ${svg.fragment`<circle cx=30 cy=30 r=30></circle>`}
</svg>`).toMatchInlineSnapshot(`
  <svg width="60" height="60">
    <circle cx="30" cy="30" r="30"></circle>
  </svg>
`);
});
