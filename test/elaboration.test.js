// Chai for assertions
import pkg_chai from "chai";
const { expect } = pkg_chai;

// DataTree for tree management
import pkg_datatree from "data-tree";
const { dataTree } = pkg_datatree;

// Local imports
import {
    Addition,
    BackgroundColor,
    BackgroundImage,
    BorderColor,
    BorderRadius,
    BorderStyle,
    BorderWidth,
    BooleanAnd, 
    BooleanOr,
    CssPropertyFunction,
    Color,
    AndElaboration,
    Elaboration,
    ConstantElaboration,
    ComposedElaboration, 
    OrElaboration,
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
    NaryDisjunctiveVerdict,
    ObjectNode,
    Opacity,
    PathValue,
    PaddingTop,
    PaddingBottom,
    PaddingRight,
    PaddingLeft,
    Position,
    ReturnValue,
    StringBuilder,
    TestCondition,
    Tracer,
    UniversalQuantifier,
    Visibility,
    Zindex
} from "../index.mjs";


describe("Elaboration test",function () {
    it("Test 1 elaboration", function() {
        //Function f = And("$x", "$y"); //Or("$y", "$z"));
		var f = new BooleanAnd();
		var v = f.evaluate(true, false);
        expect(v).to.be.an.instanceof(NaryDisjunctiveVerdict);
        expect(v.getValue()).to.be.false;
		var t = new Tracer();
		var root = t.getAndNode();
        var leaves = v.query(null, ReturnValue.instance, root, t);

        console.log(root);
		//v.query((null, ReturnValue.instance, root, t));
		var e_short = root.getShort();
        console.log(e_short);
		//var e_long = root.getLong();
        //console.log(e_long);
    });
})