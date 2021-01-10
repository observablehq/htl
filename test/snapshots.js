import {html, svg} from "htl";

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
  return html`My favorite currencies are ${"dollars&pounds"}.`;
}

export function escapeTags() {
  return html`Look, Ma, ${"<i>automatic escaping</i>"}!`;
}

export function interpolatedString() {
  return html`Hello, ${"world"}!`;
}

export function interpolatedNumber() {
  return html`Hello, ${42}!`;
}

export function interpolateIntoRawText() {
  return html`<style>p { background-image: url(${"foo.png?bar=1&baz=2"}); }</style>`;
}

export function interpolateIntoScript() {
  return html`<script>${"value"}</script>`;
}

export function interpolateIntoRawTextWithNonmatchingEndTag() {
  return html`<script></style>${"value"}</script>`;
}

export function escapeIntoRawText() {
  return html`<script>${"1 < 2"}</script>`;
}

export function escapeNonmatchingEndTagIntoRawText() {
  return html`<script>${"</style>"}</script>`;
}

export function interpolateIntoStyle() {
  return html`<style>${"value"}</style>`;
}

export function interpolateIntoTextarea() {
  return html`<textarea>${"value"}</textarea>`;
}

export function interpolateIntoTitle() {
  return html`<title>${"value"}</title>`;
}

export function interpolatedStyleObject() {
  return html`<span style=${{background: "yellow"}}>It’s all yellow!</span>`;
}

export function interpolatedStyleString() {
  return html`<span style="background: ${"yellow; font-style: italic"};">It’s yellow (and italic).</span>`;
}

export function booleanAttribute() {
  return html`<button disabled=${true}>Can’t click me</button>`;
}

export function optionalAttribute() {
  return html`<button disabled=${null}>Can click me</button>`;
}

export function unquotedAttribute() {
  return html`<font color=${"red"}>`;
}

export function trailingUnquotedAttribute() {
  return html`<font color=${"red"}${"blue"}>`;
}

export function trailingBooleanAttribute() {
  return html`<font color=${true}${"blue"}>`;
}

export function escapeUnquotedAttribute() {
  return html`<font color=${'="red"'}>`;
}

export function optionalText() {
  return html`There’s no ${null} here.`;
}

export function interpolatedNull() {
  return html`${html``}`; // It’s nulls all the way down!
}

export function spreadAttributes() {
  return html`<span ${{style: {background: "yellow", fontWeight: "bold"}}}>whoa</span>`;
}

export function interpolatedNode() {
  function emphasize(text) {
    return html`<i>${text}</i>`;
  }
  return html`This is ${emphasize("really")} important.`;
}

export function interpolateFragment() {
  return html`<table style="width: 180px;">
  <thead><tr><th>#</th><th>Color</th><th>Swatch</th></tr></thead>
  <tbody>${["red", "green", "blue"].map((color, i) => html.fragment`<tr>
    <td>${i}</td>
    <td>${color}</td>
    <td style=${{background: color}}></td>
  </tr>`)}</tbody>
</table>`;
}

export function interpolateSet() {
  return html`It’s as easy as ${new Set([1, 2, 3])}.`;
}

export function staticSvg() {
  return svg`<svg width=60 height=60>
  <circle cx=30 cy=30 r=30></circle>
</svg>`;
}

export function interpolateSvgFragment() {
  return svg`<svg width=60 height=60>
  ${svg.fragment`<circle cx=30 cy=30 r=30></circle>`}
</svg>`;
}
