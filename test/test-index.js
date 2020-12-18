//Example without jsdom

let assert = require("assert");
const { it } = require("mocha");
let index = require("..");

describe("Test Hello World", function () {
  it("Test should return hello world", function () {
    assert.equal(index(), "Hello World!");
  });
});
