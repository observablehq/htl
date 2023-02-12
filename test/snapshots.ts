import {html, svg} from "../src/index.js";

export function staticNull() {
  return html``;
}

export function staticText() {
  return html`Hello, world!`;
}

export function staticImpliedSpan() {
  return html`Hello, <i>world</i>!`;
}

export function staticExplicitSpan() {
  return html`<span>Hello, <i>world</i>!</span>`;
}

export function escapeEntity() {
  // @ts-ignore
  return html`My favorite currencies are ${"dollars&pounds"}.`;
}

export function escapeTags() {
  // @ts-ignore
  return html`Look, Ma, ${"<i>automatic escaping</i>"}!`;
}

export function interpolatedString() {
  // @ts-ignore
  return html`Hello, ${"world"}!`;
}

export function interpolatedNumber() {
  // @ts-ignore
  return html`Hello, ${42}!`;
}

export function interpolateIntoRawText() {
  // @ts-ignore
  return html`<style>p { background-image: url(${"foo.png?bar=1&baz=2"}); }</style>`;
}

export function interpolateIntoScript() {
  // @ts-ignore
  return html`<script>${"value"}</script>`;
}

export function interpolateIntoRawTextWithNonmatchingEndTag() {
  // @ts-ignore
  return html`<script></style>${"value"}</script>`;
}

export function escapeIntoRawText() {
  // @ts-ignore
  return html`<script>${"1 < 2"}</script>`;
}

export function escapeNonmatchingEndTagIntoRawText() {
  // @ts-ignore
  return html`<script>${"</style>"}</script>`;
}

export function interpolateIntoStyle() {
  // @ts-ignore
  return html`<style>${"value"}</style>`;
}

export function interpolateIntoTextarea() {
  // @ts-ignore
  return html`<textarea>${"value"}</textarea>`;
}

export function interpolateIntoTitle() {
  // @ts-ignore
  return html`<title>${"value"}</title>`;
}

export function interpolatedStyleObject() {
  // @ts-ignore
  return html`<span style=${{background: "yellow"}}>It’s all yellow!</span>`;
}

export function interpolatedStyleObjectWithCustomProperty() {
  // @ts-ignore
  return html`<span style=${{"--custom-property": "yellow"}}>It’s all yellow!</span>`;
}

export function interpolatedStyleString() {
  // @ts-ignore
  return html`<span style="background: ${"yellow; font-style: italic"};">It’s yellow (and italic).</span>`;
}

export function booleanAttribute() {
  // @ts-ignore
  return html`<button disabled=${true}>Can’t click me</button>`;
}

export function optionalAttribute() {
  // @ts-ignore
  return html`<button disabled=${null}>Can click me</button>`;
}

export function unquotedAttribute() {
  // @ts-ignore
  return html`<font color=${"red"}>`;
}

export function trailingUnquotedAttribute() {
  // @ts-ignore
  return html`<font color=${"red"}${"blue"}>`;
}

export function trailingBooleanAttribute() {
  // @ts-ignore
  return html`<font color=${true}${"blue"}>`;
}

export function escapeUnquotedAttribute() {
  // @ts-ignore
  return html`<font color=${'="red"'}>`;
}

export function optionalText() {
  // @ts-ignore
  return html`There’s no ${null} here.`;
}

export function unquotedEmptyString() {
  // @ts-ignore
  return html`<input value=${""} type="input">`;
}

export function unquotedEmptyStringAfterPrefix() {
  // @ts-ignore
  return html`<input value=prefix${""} type="input">`;
}

export function interpolatedNull() {
  // @ts-ignore
  return html`${html``}`; // It’s nulls all the way down!
}

export function spreadAttributes() {
  // @ts-ignore
  return html`<span ${{style: {background: "yellow", fontWeight: "bold"}}}>whoa</span>`;
}

export function interpolatedNode() {
  function emphasize(text: any) {
    // @ts-ignore
    return html`<i>${text}</i>`;
  }
  // @ts-ignore
  return html`This is ${emphasize("really")} important.`;
}

export function interpolateFragment() {
  return html`<table style="width: 180px;">
  <thead><tr><th>#</th><th>Color</th><th>Swatch</th></tr></thead>
  <tbody>${// @ts-ignore 
    ["red", "green", "blue"].map((color, i) => html.fragment`<tr>
    <td>${// @ts-ignore
      i}</td>
    <td>${color}</td>
    <td style=${{background: color}}></td>
  </tr>`)}</tbody>
</table>`;
}

export function interpolateSet() {
  // @ts-ignore
  return html`It’s as easy as ${new Set([1, 2, 3])}.`;
}

export function staticSvg() {
  return svg`<svg width=60 height=60>
  <circle cx=30 cy=30 r=30></circle>
</svg>`;
}

export function interpolateSvgFragment() {
  return svg`<svg width=60 height=60>
  ${// @ts-ignore
    svg.fragment`<circle cx=30 cy=30 r=30></circle>`}
</svg>`;
}
