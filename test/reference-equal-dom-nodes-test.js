import assert from "assert";
import {html, svg} from "../src/index.js";
import it from "./jsdom.js";

describe("html text node", () => {
  it("flat", () => {
    let node = html`x`;
    assert.deepStrictEqual(html`${node}${node}`.textContent, 'xx');
  });
  it("array", () => {
    let node = html`x`;
    assert.deepStrictEqual(html`${[node, node]}`.textContent, 'xx');
  });
});

describe("html element", () => {
  it("flat", () => {
    let node = html`<span>x</span>`;
    assert.deepStrictEqual(html`${node}${node}`.textContent, 'xx');
  });
  it("array", () => {
    let node = html`<span>x</span>`;
    assert.deepStrictEqual(html`${[node, node]}`.textContent, 'xx');
  });
});

describe("svg element", () => {
  it("flat", () => {
    let node = svg`<g>x</g>`;
    assert.deepStrictEqual(svg`${node}${node}`.textContent, 'xx');
  });
  it("array", () => {
    let node = svg`<g>x</g>`;
    assert.deepStrictEqual(svg`${[node, node]}`.textContent, 'xx');
  });
});

describe("html fragments", () => {
  it("flat", () => {
    let node = html.fragment`<span>x</span>`;
    assert.deepStrictEqual(html.fragment`${node}${node}`.textContent, 'xx');
  });
  it("array", () => {
    let node = html.fragment`<span>x</span>`;
    assert.deepStrictEqual(html.fragment`${[node, node]}`.textContent, 'xx');
  });
});

describe("svg fragments", () => {
  it("flat", () => {
    let node = svg.fragment`<g>x</g>`;
    assert.deepStrictEqual(svg.fragment`${node}${node}`.textContent, 'xx');
  });
  it("array", () => {
    let node = svg.fragment`<g>x</g>`;
    assert.deepStrictEqual(svg.fragment`${[node, node]}`.textContent, 'xx');
  });
});

describe("array-likes", () => {
  it("html node list", () => {
    let nodes = html`<div><span>x</span><span>x</span></div>`.querySelectorAll('span');
    assert.deepStrictEqual(html`${nodes}${nodes}`.textContent, 'xxxx');
  });

  it("html collection", () => {
    let nodes = html`<div><span>x</span><span>x</span></div>`.getElementsByTagName('span');
    assert.deepStrictEqual(html`${nodes}${nodes}`.textContent, 'xxxx');
  });
});
