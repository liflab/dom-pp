// Example With jsdom

const { expect } = require("chai");
const chai = require("chai");
const { JSDOM } = require("jsdom");
chai.use(require("chai-dom"));
require("jsdom-global")();

describe("Test h1 with jsdom", () => {
  beforeEach((done) => {
    JSDOM.fromFile("./test/index-jsdom2.html")
      .then((dom) => {
        global.document = dom.window.document;
      })
      .then(done, done);
  });
  describe("JSDOM Tests", () => {
    it("h1 element should say 'Hello World!'", () => {
      const element = document.querySelector("h1");
      ////////////////////////////////
      const path = getXPathForElement(element);
      console.log("");
      console.log("Test 1");
      console.log("Path of element is : ", path);
      console.log(element === getElementByXPath(path)); // true
      console.log("");
      ///////////////////////////////
      expect(element).to.have.text("Hello World!");
    });
    it("h2 element should say 'Hello'", () => {
      const element = document.getElementById("h2");
      ////////////////////////////////
      const path = getXPathForElement(element);
      console.log("");
      console.log("Test 2");
      console.log("Element ID is : ", path);
      console.log(element === getElementByXPath(path)); // true
      console.log("");
      ///////////////////////////////
      expect(element).to.have.text("Hello");
    });
    it("Li element should say 'Option2'", () => {
      const element = document.querySelector("li:nth-child(2)");
      ////////////////////////////////
      const path = getXPathForElement(element);
      console.log("");
      console.log("Test 3");
      console.log("Li Child path is : ", path);
      console.log(element === getElementByXPath(path)); // true
      console.log("");
      ///////////////////////////////
      expect(element).to.have.text("option2");
    });
    it("Div element should say 'Bonjour'", () => {
      const element = document.querySelector("#b div:nth-child(3)");
      ////////////////////////////////
      const path = getXPathForElement(element);
      console.log("");
      console.log("Test 4");
      console.log("Div path is : ", path);
      console.log(element === getElementByXPath(path)); // true
      console.log("");
      ///////////////////////////////
      expect(element).to.have.text("bonjour");
    });
  });
});

//////////////////////////////////////////////////////////////// Find XPath //////////////////////////////////

function getXPathForElement(element) {
  const idx = (sib, name) =>
    sib
      ? idx(sib.previousElementSibling, name || sib.localName) +
        (sib.localName == name)
      : 1;
  const segs = (elm) =>
    !elm || elm.nodeType !== 1
      ? [""]
      : elm.id && document.getElementById(elm.id) === elm
      ? [`id("${elm.id}")`]
      : [
          ...segs(elm.parentNode),
          `${elm.localName.toLowerCase()}[${idx(elm)}]`,
        ];
  return segs(element).join("/");
}

function getElementByXPath(path) {
  return new XPathEvaluator().evaluate(
    path,
    document.documentElement,
    null,
    XPathResult.FIRST_ORDERED_NODE_TYPE, //FIRST_ORDERED_NODE_TYPE,
    null
  ).singleNodeValue;
}
//////////////////////////////////////////////////////////////////////////////

function getElementXPath(element) {
  if (!element) return null;

  if (element.id) {
    return `//*[@id=${element.id}]`;
  } else if (element.tagName === "BODY") {
    return "/html/body";
  } else {
    const sameTagSiblings = Array.from(element.parentNode.childNodes).filter(
      (e) => e.nodeName === element.nodeName
    );
    const idx = sameTagSiblings.indexOf(element);

    return (
      getElementXPath(element.parentNode) +
      "/" +
      element.tagName.toLowerCase() +
      (sameTagSiblings.length > 1 ? `[${idx + 1}]` : "")
    );
  }
}
