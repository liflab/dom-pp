// Example With jsdom

const { expect } = require("chai");
const chai = require("chai");
const { JSDOM } = require("jsdom");
chai.use(require("chai-dom"));
require("jsdom-global")();

describe("Test h1 with jsdom", () => {
  beforeEach((done) => {
    JSDOM.fromFile("./test/index-jsdom.html")
      .then((dom) => {
        global.document = dom.window.document;
      })
      .then(done, done);
  });
  describe("Level 1 heading", () => {
    it("h1 element should say 'Hello World!'", () => {
      let element = document.querySelector("h1");
      expect(element).to.have.text("Hello World!");
    });
  });
});
