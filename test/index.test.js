const { JSDOM } = require("jsdom");

// Transfer necessary DOM APIs to Node scope for test ergonomics.
global.Node = window.Node
global.document = window.document

const esmImport = require('esm')(module);
esmImport('./html.assert')
