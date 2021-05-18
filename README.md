# Hypertext Literal

Hypertext Literal is a tagged template literal for HTML which interpolates values *based on context*, allowing automatic escaping and the interpolation of non-serializable values, such as event listeners, style objects, and other DOM nodes. It is inspired by [lit-html](https://lit-html.polymer-project.org/) and [HTM](https://github.com/developit/htm), and references the fantastically precise [HTML5 spec](https://html.spec.whatwg.org/multipage/parsing.html#tokenization).

Hypertext Literal is open-sourced under the permissive ISC license, small (2KB), has no dependencies, and is available [on npm](https://www.npmjs.com/package/htl). To install:

```
npm install htl
```

See this README with live examples on Observable:

https://observablehq.com/@observablehq/htl

## Why not concatenate?

Surely the simplest way to generate web content is to write [HTML](https://developer.mozilla.org/en-US/docs/Web/HTML). Modern JavaScript makes it easier than ever to interpolate values into literal HTML thanks to [template literals](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals).

```js
const value1 = "world";
const html = `<h1>Hello ${value1}</h1>`;
```

Yet simple concatenation has two significant drawbacks.

First, it confounds markup with text and other content. If an interpolated value happens to include characters that are meaningful markup, the result may render unexpectedly. An ampersand (&) can be interpreted as a character entity reference, for instance.

```js
const value2 = "dollars&pounds";
const html = `My favorite currencies are ${value2}.`;
```

This can be fixed by escaping (say replacing ampersands with the corresponding entity, `&amp;`). But you must remember to escape every time you interpolate, which is tedious! And it’s easy to forget when many values work as intended without it.

```js
const html = `My favorite currencies are ${value2.replace(/&/g, "&amp;")}.`;
```

Second, concatenation impedes composition: interpolated content must be serialized as markup. You cannot combine literal HTML with content created by the DOM API, or a library such as React or D3. And some content, such as event listeners implemented as closures, can’t be serialized!

## Features

Hypertext Literal is a tagged template literal that renders the specified markup as an element, text node, or null as appropriate.

```js
html`<i>I’m an element!</i>` // returns an <i> element
```
```js
html`I’m simply text.` // returns a text node
```
```js
html`` // returns null
```

If multiple top-level nodes are given, the nodes are implicitly wrapped in a SPAN element.

```js
html`I’m an <i>implicit</i> span.` // returns a <span> element
```

If you’d prefer a [document fragment](https://developer.mozilla.org/en-US/docs/Web/API/DocumentFragment) instead, as when composing hypertext literal fragments, call html.fragment.

```js
html.fragment`I’m a <i>document fragment</i>.` // returns a DocumentFragment
```

### Automatic escaping

If a value is interpolated into an attribute value or data, it is escaped appropriately so as to not change the structure of the surrounding markup.

```js
html`Look, Ma, ${"<i>automatic escaping</i>"}!`
```
```js
html`<font color=${"red"}>This text has color.</font>`
```

In cases where it is not possible to interpolate safely, namely with script and style elements where the interpolated value contains the corresponding end tag, an error is thrown.

```js
html`<script>${"</script>"}</script>` // Error: unsafe raw text
```

### Styles

You can safely interpolate into style properties, too, by specifying the style attribute as an object literal.

```js
html`<span style=${{background: "yellow"}}>It’s all yellow!</span>`
```

You can interpolate into a style attribute as a string, too, but use caution: automatic escaping will still allow you to set multiple style properties this way, or to generate invalid CSS.

```js
html`<span style="background: ${"yellow; font-style: italic"};">It’s yellow (and italic).</span>`
```

### Function attributes

If an attribute value is a function, it is assigned as a property. This can be used to register event listeners.

```js
html`<button onclick=${() => alert("hello!")}>click me</button>`
```

### Boolean attributes

If an attribute value is false, it’s as if the attribute hadn’t been specified. If an attribute value is true, it’s equivalent to the empty string.

```js
html`<button disabled=${true}>Can’t click me</button>`
```

### Optional values

If an attribute value is null or undefined, it’s as if the attribute hadn’t been specified. If a data value is null or undefined, nothing is embedded.

```js
html`<button disabled=${null}>Can click me</button>` // enabled!
```
```js
html`There’s no ${null} here.` // “There’s no  here.”
```
```js
html`${html``}` // returns null
```

### Spread attributes

You can set multiple attributes (or styles, or event listeners) by interpolating an object in place of attributes.

```js
html`<span ${{style: {background: "yellow", fontWeight: "bold"}}}>whoa</span>`
```
```js
html`<span ${{
  onmouseover() { this.style.background = "yellow"; },
  onmousedown() { this.style.background = "red"; },
  onmouseup() { this.style.background = "yellow"; },
  onmouseout() { this.style.background = ""; }
}}>hover me</span>`
```

### Node values

If an interpolated data value is a node, it is inserted into the result at the corresponding location. So if you have a function that generates a node (say itself using hypertext literal), you can embed the result into another hypertext literal.

```js
function emphasize(text) {
  return html`<i>${text}</i>`;
}
```
```js
html`This is ${emphasize("really")} important.`
```

### Iterable values

You can interpolate iterables into data, too, even iterables of nodes. This is useful for mapping data to content via [*array*.map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) or [Array.from](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/from). Typically, you should use html.fragment for the embedded expressions.

```js
html`<table style="width: 180px;">
  <thead><tr><th>#</th><th>Color</th><th>Swatch</th></tr></thead>
  <tbody>${d3.schemeCategory10.map((color, i) => html.fragment`<tr>
    <td>${i}</td>
    <td>${color}</td>
    <td style=${{background: color}}></td>
  </tr>`)}</tbody>
</table>`
```
```js
html`It’s as easy as ${new Set([1, 2, 3])}.`
```

### SVG

You can create contextual SVG fragments using hypertext literals, too.

```js
svg`<svg width=60 height=60>
  ${svg.fragment`<circle cx=30 cy=30 r=30></circle>`}
</svg>`
```

### Errors on invalid bindings

Hypertext literal tolerates malformed input—per the HTML5 specification—but it still tries to be helpful by throwing an error if you interpolate a value into an unexpected place. For instance, it doesn’t allow dynamic tag names.

```js
html`<${"button"}>Does this work?</>` // Error: invalid binding
```

### Use with DOM API

You can put the element (or text node, or fragment) produced from a hypertext literal directly into the DOM:

```js
const subject = "world";
document.body.appendChild(html`<h1>Hello, ${subject}!</h1>`);
```

## How it works

Under the hood, hypertext literal implements a subset of the [HTML5 tokenizer](https://html.spec.whatwg.org/multipage/parsing.html#tokenization) state machine. This allows it to distinguish between tags, attributes, and the like. And so wherever an embedded expression occurs, it can be interpreted correctly.

Our approach is more formal (and, if you like, more precise) than lit-html, which uses regular expressions to search for “attribute-like sequences” in markup. And while our approach requires scanning the input, the state machine is pretty fast.

Also unlike lit-html, hypertext literal directly creates content rather than reusable templates. Hypertext literal is thus well-suited to Observable, where our [dataflow runtime](/@observablehq/how-observable-runs) runs cells automatically when inputs change. If you want incremental updates for performance (or transitions), you can opt-in, but it’s nice to keep things simple by default.

We also wanted to minimize new syntax. We were inspired by [HTM](https://github.com/developit/htm), but HTM emulates JSX—not HTML5—requiring closing tags for every element. HTM’s approach would also need to be adapted for contextual namespaces, such as SVG, since it creates content bottom-up.

For a closer look at our implementation, please view the source and let us know what you think! We welcome your contributions and bug reports on GitHub.
