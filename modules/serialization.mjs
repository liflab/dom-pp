import {
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
    MarginTop,
    MarginBottom,
    MarginRight,
    MarginLeft,
    ObjectNode,
    Opacity,
    Path,
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
    Zindex,
} from "../index.mjs";
class Serialization{
    constructor() {
    }
    /**
     * Build method deserialize(j), j is a JSON structure,
     * this method will produce a Function object
     */

    deserialize(j) {
        //only letters are accepted
        const validation = /^[A-Za-z]+$/;
        if (j.name.match(validation)) {
            var functionClass = eval(j.name)
            return functionClass.deserialize(this, j)
        }

    }
    serialize(s){
        var functionClass = eval(s.constructor.name)
        return functionClass.toJson(s)
    }
}

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
                0.9
            ]
        }
    ]
};

const circularReplacer = () => {

    // Creating new WeakSet to keep
    // track of previously seen objects
    const seen = new WeakSet();

    return (key, value) => {

        // If type of value is an
        // object or value is null
        if (typeof(value) === "object" &&
            value !== null) {

            // If it has been seen before
            if (seen.has(value)) {
                return 'Object';
            }

            // Add current value to the set
            seen.add(value);
        }

        // return the value
        return value;
    };
};

var v = {
    "name": "ComposedFunction",
    "contents": [
        "$x",
        {
            "name": "FindBySelector",
            "contents": [
                "#h2"
            ]
        }
    ]
}
var c = new Serialization().deserialize(j)
//console.log(c);
console.log("****************json*****************");
var b = new Serialization().serialize(c)
console.log(b);
console.log("--------------------------------------");
console.log(b.contents[1]);
console.log(b.contents[2]);

export { Serialization };