import { AbstractFunction } from "./function.mjs";
//import { UniversalQuantifier } from "./quantifier.mjs";
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
class Deserializer {
    constructor() {
        this.names = [];
    }


    /**
     * Build method deserialize(j) ,j is a JSON structure , this methode will produce a Function object
     */

    deserialize(j) {
        //add the fisrt name in the array
        //var names = [j.name]
            //add the name of all descendants in the array
        //var classNames = this.getClassName(j, names)
            //console.log(classNames);
        //var instances;
        //for (const className in classNames) {
            //only letters are accepted
            const validation = /^[A-Za-z]+$/;
            if (j.name.match(validation)) {
                var functionClass = eval(j.name)
                return functionClass.deserialize(this, j)
            }
        //}
        //return instances;
    }

    getClassName(obj, names = []) {
        for (const i in obj) {
            if (Array.isArray(obj[i]) || typeof obj[i] === 'object') {
                if (obj[i].name != undefined) {
                    names.push(obj[i].name)

                }
                this.getClassName(obj[i], names);
            }
        }
        return names;
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
                {
                    "name": "ConstantFunction",
                    "contents": [{
                            "name": "Opacity",
                            "contents": []
                        },
                        0.9
                    ]
                }
            ]
        }
    ]
};

var c = new Deserializer().deserialize(j)
console.log(c)

	
//var jsonString = JSON.stringify( c, circularReplacer());
//console.log(JSON.parse(jsonString));

export { Deserializer };