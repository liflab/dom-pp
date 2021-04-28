/**
 * Imports
 */
// Chai for assertions
import pkg_chai from "chai";
const { expect } = pkg_chai;

// JSDOM for DOM trees
import pkg_jsdom from "jsdom";
const { JSDOM } = pkg_jsdom;
import "jsdom-global";

// DataTree for tree management
import pkg_datatree from "data-tree";
const { dataTree } = pkg_datatree;

// Local imports
import { getVerdict } from "../index.mjs";
import {
    Addition,
    BackgroundColor,
    BackgroundImage,
    BorderColor,
    BorderRadius,
    BorderStyle,
    BorderWidth,
    CssPropertyFunction,
    Color,
    CompoundDesignator,
    ComposedFunction,
    ConstantDesignator,
    ConstantFunction,
    ComposedFunctionValue,
    DimensionHeight,
    Display,
    DimensionWidth,
    ElementAttributeValue,
    EnumeratedValue,
    FindBySelector,
    Float,
    FontFamily,
    FontSize,
    FontWeight,
    GreaterThan,
    GreaterOrEqual,
    IsEqualTo,
    MarginTop,
    MarginBottom,
    MarginRight,
    MarginLeft,
    ObjectNode,
    Opacity,
    PathValue,
    PaddingTop,
    PaddingBottom,
    PaddingRight,
    PaddingLeft,
    Position,
    ReturnValue,
    TestCondition,
    Tracer,
    UniversalQuantifier,
    Visibility,
    Zindex
} from "../index.mjs";
import { Serialization } from "../index.mjs";
import { expect_to_throw } from "./test-util.mjs";


describe("Test Serialization", () => {
    const sampleserizalisation = new Serialization()
    let deserialized
    var expectedJsonExample = {
        "name": "GreaterThan",
        "contents": []
    }

    it("should be return true when input json is object", function () {
        expect(expectedJsonExample).to.be.an("object")
    })

    it("should deserialize and serialize an object json ", function () {
        deserialized = sampleserizalisation.deserialize(expectedJsonExample)
        const serialized = sampleserizalisation.serialize(deserialized)
        expect(expectedJsonExample).to.be.deep.equal(serialized)
        //expect(j).to.be.deep.equal(f)
    })

    it("Test opacity from json structure", async () => {
        var j = {
            "name": "UniversalQuantifier",
            "contents": [
                "$x",
                {
                    "name": "FindBySelector",
                    "contents": [
                        "#h2"
                    ]
                },
                {
                    "name": "ComposedFunction",
                    "contents": [{
                        "name": "GreaterThan",
                        "contents": []
                    },
                    {
                        "name": "ComposedFunction",
                        "contents": [{
                            "name": "Opacity",
                            "contents": []
                        },
                            "$x"
                        ]
                    },
                    {
                        "name": "ConstantFunction",
                        "contents": [0.9]
                    }
                    ]
                }
            ]
        }
        var dom = await load_dom("./test/pages/stub-1.html");
        var body = dom.window.document.body;
        deserialized = sampleserizalisation.deserialize(j);
        var cond = new TestCondition("h2's opacity is equal to 1", deserialized);
        var tree = getVerdict(body, cond);
        //console.log(tree);
        //console.log('============ serialization ==============')
        //var f = new Serialization().serialize(des);
        //console.log(f)
    });
    it("Test Background-color from json structure", async() => {
        var j = {
            "name": "UniversalQuantifier",
            "contents": [
                "$x",
                {
                    "name": "FindBySelector",
                    "contents": [
                        "#p1"
                    ]
                },
                {
                    "name": "ComposedFunction",
                    "contents": [{
                            "name": "IsEqualTo",
                            "contents": []
                        },
                        {
                            "name": "ComposedFunction",
                            "contents": [{
                                    "name": "BackgroundColor",
                                    "contents": []
                                },
                                "$x"
                            ]
                        },
                        {
                            "name": "ConstantFunction",
                            "contents": ["blue"]
                        }
                    ]
                }
            ]
        }
        var dom = await load_dom("./test/pages/stub-1.html");
        var body = dom.window.document.body;
        var deserialized = sampleserizalisation.deserialize(j);
        var cond = new TestCondition("p1's background-color is  blue", deserialized);
        var tree = getVerdict(body, cond);
        // console.log(tree);
        // console.log('============ serialization ==============')
        // var f = new Serialization().serialize(des);
        //console.log(f)
    });

    it("Test GreaterThan from json structure", function () {
        var j = {
            "name": "GreaterThan",
            "contents": []
        }
        deserialized = sampleserizalisation.deserialize(j);
        var gt = deserialized.evaluate(4, 3)
        expect(gt.getValue()).to.be.true;

        //console.log('============ serialization Test GreaterThan ==============')
        //var f = new Serialization().serialize(s);
        //console.log(f)
        //expect(j).to.be.deep.equal(f)

    });
    it("Test FindbySelector from json structure", async () => {
        var j = {
            "name": "FindBySelector",
            "contents": [
                "#h2"
            ]
        }
        var dom = await load_dom("./test/pages/stub-1.html");
        var body = dom.window.document.body;
        deserialized = sampleserizalisation.deserialize(j);
        //console.log(s)
        //var cond = new TestCondition("h2's Selector", s);
        var v = deserialized.evaluate(body);
        var elems = v.getValue();
        //console.log(elems)
        expect(Array.isArray(elems)).to.be.true;
        expect(elems.length).to.equal(1);
        var e1 = elems[0];
        expect(e1).to.be.an.instanceof(EnumeratedValue);
        var v1 = e1.getValue();
        expect(v1.tagName).to.equal("H2");

        //console.log('============ serialization Test FindbySelector ==============')
        //var f = new Serialization().serialize(s);
        //console.log(f)

    });

    it("Test Composed Function from json structure", function () {
        var j = {
            "name": "ComposedFunction",
            "contents": [{
                "name": "Addition",
                "contents": []
            },
                4,
                1
            ]
        }
        var deserialized = sampleserizalisation.deserialize(j);
        //console.log(cf)
        expect(deserialized.getArity()).to.equal(0);
        var r = deserialized.evaluate();
        expect(r).to.be.an.instanceof(ComposedFunctionValue);
        var v = r.getValue();
        expect(v).to.equal(5);

        //console.log('============ serialization Test Composed Function ==============')
        //var f = new Serialization().serialize(cf);
        //console.log(f)

    });

});

/**
 * Reads a DOM from a file. This function is only meant to avoid cluttering
 * the code with promises and anonymous functions in every test case.
 * @param {String} filename The name of the local file to read from
 * @param A promise which, when fulfilled, returns the DOM object.
 */
async function load_dom(filename) {
    return JSDOM.fromFile(filename).then((dom) => {
        return dom;
    });
}
// :wrap=soft:tabSize=2:indentWidth=2: