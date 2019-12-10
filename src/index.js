export const html = hypertext(
  string => {
    const template = document.createElement("template");
    template.innerHTML = string;
    return template.content;
  },
  root => {
    const span = document.createElement("span");
    span.appendChild(root);
    return span;
  }
);

export const svg = hypertext(
  string => {
    const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
    g.innerHTML = string;
    return g;
  }
);

const
CODE_TAB = 9,
CODE_LF = 10,
CODE_FF = 12,
CODE_CR = 13,
CODE_SPACE = 32,
CODE_UPPER_A = 65,
CODE_UPPER_Z = 90,
CODE_LOWER_A = 97,
CODE_LOWER_Z = 122,
CODE_LT = 60,
CODE_GT = 62,
CODE_SLASH = 47,
CODE_DASH = 45,
CODE_BANG = 33,
CODE_EQ = 61,
CODE_DQUOTE = 34,
CODE_SQUOTE = 39,
CODE_QUESTION = 63,
STATE_DATA = 1,
STATE_TAG_OPEN = 2,
STATE_END_TAG_OPEN = 3,
STATE_TAG_NAME = 4,
STATE_BOGUS_COMMENT = 5,
STATE_BEFORE_ATTRIBUTE_NAME = 6,
STATE_AFTER_ATTRIBUTE_NAME = 7,
STATE_ATTRIBUTE_NAME = 8,
STATE_BEFORE_ATTRIBUTE_VALUE = 9,
STATE_ATTRIBUTE_VALUE_DOUBLE_QUOTED = 10,
STATE_ATTRIBUTE_VALUE_SINGLE_QUOTED = 11,
STATE_ATTRIBUTE_VALUE_UNQUOTED = 12,
STATE_AFTER_ATTRIBUTE_VALUE_QUOTED = 13,
STATE_SELF_CLOSING_START_TAG = 14,
STATE_COMMENT_START = 15,
STATE_COMMENT_START_DASH = 16,
STATE_COMMENT = 17,
STATE_COMMENT_LESS_THAN_SIGN = 18,
STATE_COMMENT_LESS_THAN_SIGN_BANG = 19,
STATE_COMMENT_LESS_THAN_SIGN_BANG_DASH = 20,
STATE_COMMENT_LESS_THAN_SIGN_BANG_DASH_DASH = 21,
STATE_COMMENT_END_DASH = 22,
STATE_COMMENT_END = 23,
STATE_COMMENT_END_BANG = 24,
STATE_MARKUP_DECLARATION_OPEN = 25,
SHOW_COMMENT = 128,
SHOW_ELEMENT = 1;

function hypertext(parse, wrap = root => root) {
  return function(strings) {
    let state = STATE_DATA;
    let string = "";
    let nameStart;
    let nameEnd;
    let nodeFilter = 0;

    for (let j = 0, m = arguments.length; j < m; ++j) {
      const input = strings[j];

      if (j > 0) {
        const value = arguments[j];
        switch (state) {
          case STATE_DATA: {
            if (value == null) {
              // ignore
            } else if (value instanceof Node || (typeof value !== "string" && value[Symbol.iterator])) {
              string += "<!--::" + j + "-->";
              nodeFilter |= SHOW_COMMENT;
            } else {
              string += (value + "").replace(/[<&]/g, entity);
            }
            break;
          }
          case STATE_BEFORE_ATTRIBUTE_VALUE: {
            const code = input.charCodeAt(0);
            state = STATE_ATTRIBUTE_VALUE_UNQUOTED;
            if (isSpaceCode(code) || code === CODE_GT) {
              if (value == null || value === false) {
                string = string.slice(0, nameStart - strings[j - 1].length);
                break;
              }
              if (value === true) {
                string += "''";
                break;
              }
              const name = strings[j - 1].slice(nameStart, nameEnd);
              if ((name === "style" && isObjectLiteral(value)) || typeof value === "function") {
                string += "::" + j;
                nodeFilter |= SHOW_ELEMENT;
                break;
              }
            }
            string += (value + "").replace(/^['"]|[\s>]/g, entity);
            break;
          }
          case STATE_ATTRIBUTE_VALUE_UNQUOTED: {
            string += (value + "").replace(/[\s>]/g, entity);
            break;
          }
          case STATE_ATTRIBUTE_VALUE_SINGLE_QUOTED: {
            string += (value + "").replace(/'/g, entity);
            break;
          }
          case STATE_ATTRIBUTE_VALUE_DOUBLE_QUOTED: {
            string += (value + "").replace(/"/g, entity);
            break;
          }
          case STATE_BEFORE_ATTRIBUTE_NAME: {
            if (isObjectLiteral(value)) {
              string += "::" + j + "=''";
              nodeFilter |= SHOW_ELEMENT;
              break;
            }
            throw new Error("invalid binding");
          }
          case STATE_COMMENT: break;
          default: throw new Error("invalid binding");
        }
      }

      for (let i = 0, n = input.length; i < n; ++i) {
        const code = input.charCodeAt(i);

        switch (state) {
          case STATE_DATA: {
            if (code === CODE_LT) {
              state = STATE_TAG_OPEN;
            }
            break;
          }
          case STATE_TAG_OPEN: {
            if (code === CODE_BANG) {
              state = STATE_MARKUP_DECLARATION_OPEN;
            } else if (code === CODE_SLASH) {
              state = STATE_END_TAG_OPEN;
            } else if (isAsciiAlphaCode(code)) {
              state = STATE_TAG_NAME, --i;
            } else if (code === CODE_QUESTION) {
              state = STATE_BOGUS_COMMENT, --i;
            } else {
              state = STATE_DATA, --i;
            }
            break;
          }
          case STATE_END_TAG_OPEN: {
            if (isAsciiAlphaCode(code)) {
              state = STATE_TAG_NAME, --i;
            } else if (code == CODE_GT) {
              state = STATE_DATA;
            } else {
              state = STATE_BOGUS_COMMENT, --i;
            }
            break;
          }
          case STATE_TAG_NAME: {
            if (isSpaceCode(code)) {
              state = STATE_BEFORE_ATTRIBUTE_NAME;
            } else if (code === CODE_SLASH) {
              state = STATE_SELF_CLOSING_START_TAG;
            } else if (code === CODE_GT) {
              state = STATE_DATA;
            }
            break;
          }
          case STATE_BEFORE_ATTRIBUTE_NAME: {
            if (isSpaceCode(code)) {
              // continue
            } else if (code === CODE_SLASH || code === CODE_GT) {
              state = STATE_AFTER_ATTRIBUTE_NAME, --i;
            } else if (code === CODE_EQ) {
              state = STATE_ATTRIBUTE_NAME;
              nameStart = i + 1, nameEnd = undefined;
            } else {
              state = STATE_ATTRIBUTE_NAME, --i;
              nameStart = i + 1, nameEnd = undefined;
            }
            break;
          }
          case STATE_ATTRIBUTE_NAME: {
            if (isSpaceCode(code) || code === CODE_SLASH || code === CODE_GT) {
              state = STATE_AFTER_ATTRIBUTE_NAME, --i;
              nameEnd = i;
            } else if (code === CODE_EQ) {
              state = STATE_BEFORE_ATTRIBUTE_VALUE;
              nameEnd = i;
            }
            break;
          }
          case STATE_AFTER_ATTRIBUTE_NAME: {
            if (isSpaceCode(code)) {
              // ignore
            } else if (code === CODE_SLASH) {
              state = STATE_SELF_CLOSING_START_TAG;
            } else if (code == CODE_EQ) {
              state = STATE_BEFORE_ATTRIBUTE_VALUE;
            } else if (code == CODE_GT) {
              state = STATE_DATA;
            } else {
              state = STATE_ATTRIBUTE_NAME, --i;
              nameStart = i + 1, nameEnd = undefined;
            }
            break;
          }
          case STATE_BEFORE_ATTRIBUTE_VALUE: {
            if (isSpaceCode(code)) {
              // continue
            } else if (code === CODE_DQUOTE) {
              state = STATE_ATTRIBUTE_VALUE_DOUBLE_QUOTED;
            } else if (code === CODE_SQUOTE) {
              state = STATE_ATTRIBUTE_VALUE_SINGLE_QUOTED;
            } else if (code === CODE_GT) {
              state = STATE_DATA;
            } else {
              state = STATE_ATTRIBUTE_VALUE_UNQUOTED, --i;
            }
            break;
          }
          case STATE_ATTRIBUTE_VALUE_DOUBLE_QUOTED: {
            if (code === CODE_DQUOTE) {
              state = STATE_AFTER_ATTRIBUTE_VALUE_QUOTED;
            }
            break;
          }
          case STATE_ATTRIBUTE_VALUE_SINGLE_QUOTED: {
            if (code === CODE_SQUOTE) {
              state = STATE_AFTER_ATTRIBUTE_VALUE_QUOTED;
            }
            break;
          }
          case STATE_ATTRIBUTE_VALUE_UNQUOTED: {
            if (isSpaceCode(code)) {
              state = STATE_BEFORE_ATTRIBUTE_NAME;
            } else if (code === CODE_GT) {
              state = STATE_DATA;
            }
            break;
          }
          case STATE_AFTER_ATTRIBUTE_VALUE_QUOTED: {
            if (isSpaceCode(code)) {
              state = STATE_BEFORE_ATTRIBUTE_NAME;
            } else if (code === CODE_SLASH) {
              state = STATE_SELF_CLOSING_START_TAG;
            } else if (code === CODE_GT) {
              state = STATE_DATA;
            } else {
              state = STATE_BEFORE_ATTRIBUTE_NAME, --i;
            }
            break;
          }
          case STATE_SELF_CLOSING_START_TAG: {
            if (code === CODE_GT) {
              state = STATE_DATA;
            } else {
              state = STATE_BEFORE_ATTRIBUTE_NAME, --i;
            }
            break;
          }
          case STATE_BOGUS_COMMENT: {
            if (code === CODE_GT) {
              state = STATE_DATA;
            }
            break;
          }
          case STATE_COMMENT_START: {
            if (code === CODE_DASH) {
              state = STATE_COMMENT_START_DASH;
            } else if (code === CODE_GT) {
              state = STATE_DATA;
            } else {
              state = STATE_COMMENT, --i;
            }
            break;
          }
          case STATE_COMMENT_START_DASH: {
            if (code === CODE_DASH) {
              state = STATE_COMMENT_END;
            } else if (code === CODE_GT) {
              state = STATE_DATA;
            } else {
              state = STATE_COMMENT, --i;
            }
            break;
          }
          case STATE_COMMENT: {
            if (code === CODE_LT) {
              state = STATE_COMMENT_LESS_THAN_SIGN;
            } else if (code === CODE_DASH) {
              state = STATE_COMMENT_END_DASH;
            }
            break;
          }
          case STATE_COMMENT_LESS_THAN_SIGN: {
            if (code === CODE_BANG) {
              state = STATE_COMMENT_LESS_THAN_SIGN_BANG;
            } else if (code !== CODE_LT) {
              state = STATE_COMMENT, --i;
            }
            break;
          }
          case STATE_COMMENT_LESS_THAN_SIGN_BANG: {
            if (code === CODE_DASH) {
              state = STATE_COMMENT_LESS_THAN_SIGN_BANG_DASH;
            } else {
              state = STATE_COMMENT, --i;
            }
            break;
          }
          case STATE_COMMENT_LESS_THAN_SIGN_BANG_DASH: {
            if (code === CODE_DASH) {
              state = STATE_COMMENT_LESS_THAN_SIGN_BANG_DASH_DASH;
            } else {
              state = STATE_COMMENT_END, --i;
            }
            break;
          }
          case STATE_COMMENT_LESS_THAN_SIGN_BANG_DASH_DASH: {
            state = STATE_COMMENT_END, --i;
            break;
          }
          case STATE_COMMENT_END_DASH: {
            if (code === CODE_DASH) {
              state = STATE_COMMENT_END;
            } else {
              state = STATE_COMMENT, --i;
            }
            break;
          }
          case STATE_COMMENT_END: {
            if (code === CODE_GT) {
              state = STATE_DATA;
            } else if (code === CODE_BANG) {
              state = STATE_COMMENT_END_BANG;
            } else if (code !== CODE_DASH) {
              state = STATE_COMMENT, --i;
            }
            break;
          }
          case STATE_COMMENT_END_BANG: {
            if (code === CODE_DASH) {
              state = STATE_COMMENT_END_DASH;
            } else if (code === CODE_GT) {
              state = STATE_DATA;
            } else {
              state = STATE_COMMENT, --i;
            }
            break;
          }
          case STATE_MARKUP_DECLARATION_OPEN: {
            if (code === CODE_DASH && input.charCodeAt(i + 1) === CODE_DASH) {
              state = STATE_COMMENT_START, ++i;
            } else { // Note: CDATA and DOCTYPE unsupported!
              state = STATE_BOGUS_COMMENT, --i;
            }
            break;
          }
          default: {
            state = undefined;
            break;
          }
        }
      }

      string += input;
    }

    const root = parse(string);

    // TODO Set a specific attribute so we can use querySelectorAll for attributes,
    // and only use the slower tree walker for replacing comment nodes in data.
    const walker = document.createTreeWalker(root, nodeFilter, null, false);
    while (walker.nextNode()) {
      const node = walker.currentNode;
      switch (node.nodeType) {
        case 1: { // element
          const attributes = node.attributes;
          let spreadMarkers;
          let valueMarkers;
          for (let i = 0, n = attributes.length; i < n; ++i) {
            const attribute = attributes[i];
            if (/^::/.test(attribute.name)) {
              if (spreadMarkers) spreadMarkers.push(attribute);
              else spreadMarkers = [attribute];
            } else if (/^::/.test(attribute.value)) {
              if (valueMarkers) valueMarkers.push(attribute);
              else valueMarkers = [attribute];
            }
          }
          if (valueMarkers) for (const attribute of valueMarkers) {
            const value = arguments[+attribute.value.slice(2)];
            if (typeof value === "function") {
              node.removeAttribute(attribute.name);
              node[attribute.name] = value;
            } else { // style
              Object.assign(node[attribute.name], value);
            }
          }
          if (spreadMarkers) for (const attribute of spreadMarkers) {
            const value = arguments[+attribute.name.slice(2)];
            node.removeAttribute(attribute.name);
            for (const key in value) {
              const subvalue = value[key];
              if (subvalue == null || subvalue === false) {
                // ignore
              } else if (typeof subvalue === "function") {
                node[key] = subvalue;
              } else if (key === "style" && isObjectLiteral(subvalue)) {
                Object.assign(node[key], subvalue);
              } else {
                node.setAttribute(key, subvalue === true ? "" : subvalue); // TODO setAttributeNS?
              }
            }
          }
          break;
        }
        case 8: { // comment
          if (/^::/.test(node.data)) {
            const parent = node.parentNode;
            const value = arguments[+node.data.slice(2)];
            if (value instanceof Node) {
              parent.replaceChild(value, node);
            } else if (typeof value !== "string" && value[Symbol.iterator]) {
              for (const subvalue of value) {
                if (subvalue == null) continue;
                parent.insertBefore(subvalue instanceof Node ? subvalue : document.createTextNode(subvalue), node);
              }
              parent.removeChild(node);
            } else {
              parent.replaceChild(document.createTextNode(value), node);
            }
          }
          break;
        }
      }
    }

    if (root.firstChild
        && root.firstChild === root.lastChild
        && root.firstChild.nodeType === 1) {
      return root.removeChild(root.firstChild);
    }

    return wrap(root);
  };
}

function entity(character) {
  return `&#${character.charCodeAt(0).toString()};`;
}

function isAsciiAlphaCode(code) {
  return (CODE_UPPER_A <= code && code <= CODE_UPPER_Z)
      || (CODE_LOWER_A <= code && code <= CODE_LOWER_Z);
}

function isSpaceCode(code) {
  return code === CODE_TAB
      || code === CODE_LF
      || code === CODE_FF
      || code === CODE_SPACE
      || code === CODE_CR; // normalize newlines
}

function isObjectLiteral(value) {
  return value && value.toString === Object.prototype.toString;
}
