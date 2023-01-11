import assert from "assert";
import {html} from "../src/index.js";
import it from "./jsdom.js";

const source = ({raw: strings}, ...vals) => {
  let out = "";

  for (const [i, str] of strings.entries()) {
    out += str;
    out += i === strings.length - 1 ? '' : `\${${JSON.stringify(vals[i])}}`;
  }

  return `html\`${out}\``;
};

const test = {
  isBackslashEscaped: (...args) => {
    it(source(...args), () => {
      const el = html(...args);

      // only 1 non-escaped end tag
      assert.deepStrictEqual([...el.outerHTML.matchAll('</')].length, 1);

      // at least 1 escaped end tag
      assert.ok([...el.outerHTML.matchAll('<\\/')].length > 0);

      // has been parsed into 1 root element with exactly 1 child, a text node
      assert.deepStrictEqual([...el.childNodes].map((x) => x.nodeName), ['#text']);
    });
  }
};

describe("interpolating a value with an appropriate end tag into raw text is escaped correctly", () => {
  test.isBackslashEscaped`<script>${"</script>"}</script>`;
  test.isBackslashEscaped`<script>${"</scr"}${"ipt  >"}</script>`;
  test.isBackslashEscaped`<script>${"</script foo>"}</script>`;
  test.isBackslashEscaped`<style>${"</style>"}</style>`;
  test.isBackslashEscaped`<style>${"</style foo>"}</style>`;
});

describe("interpolating a value with multiple appropriate end tags into raw text is escaped correctly", () => {
  test.isBackslashEscaped`<script>${"</script>"} ${"</script>"}</script>`;
  test.isBackslashEscaped`<script>${"</scr"}${"ipt  >"} ${"</scr"}${"ipt  >"}</script>`;
  test.isBackslashEscaped`<script>${"</script foo>"} ${"</script foo>"}</script>`;
  test.isBackslashEscaped`<style>${"</style>"} ${"</style>"}</style>`;
  test.isBackslashEscaped`<style>${"</style foo>"} ${"</style foo>"}</style>`;
});

describe("JS eval", () => {
  const str = "</script>";
  const args = ((...args) => args)`<script>(() => '${str}')()</script>`;

  test.isBackslashEscaped(...args);

  it('evaluates to same value as input', () => {
    const el = html(...args);

    assert.deepStrictEqual(eval(el.textContent), str);
  });
});

describe("CSS getComputedStyle", () => {
  // a more realistic real-world use case would be `content` on a pseudo element,
  // but jsdom doesn't support `getComputedStyle` with pseudo elements, per
  // https://github.com/jsdom/jsdom/issues/1928
  const str = "url(https://example.com?q=</style>)";
  const args = ((...args) => args)`<style>span { background: ${str} }</style>`;

  test.isBackslashEscaped(...args);

  it('evaluates to same value as input', () => {
    const style = html(...args);
    const span = html`<span></span>`;

    const parent = document.createElement('div');
    parent.append(style, span);

    document.body.appendChild(parent);
    assert.deepStrictEqual(window.getComputedStyle(span).background, str);
  });
});

it("interpolating a partial value of an appropriate end tag throws an error", () => {
  assert.throws(() => html`<script></scr${"ipt>"}</script>`, Error);
});
