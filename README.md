# Hypertext Literal

Hypertext literal is a tagged template literal for HTML which interpolates values *based on context*, allowing automatic escaping and the interpolation of non-serializable values, such as event listeners, style objects, and other DOM nodes.

```js
html`<span ${{style: {background: "yellow", fontWeight: "bold"}}}>whoa</span>`
```

For more, please read:

https://observablehq.com/@observablehq/htl

To install:

```
npm install htl
```
