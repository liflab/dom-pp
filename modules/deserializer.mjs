import { AbstractFunction, ConstantFunction } from "./function.mjs";
import { UniversalQuantifier } from "./quantifier.mjs";
import { ComposedFunction } from "./composed-function.mjs";
import { GreaterThan } from "./numbers.mjs"
import { Opacity } from "./web-element.mjs"
import {
    BackgroundColor,
    BorderColor,
    BorderRadius,
    BorderStyle,
    BorderWidth,
    CssPropertyFunction,
    Color,
    CompoundDesignator,
    ConstantDesignator,
    DimensionHeight,
    Display,
    DimensionWidth,
    ElementAttributeValue,
    EnumeratedValue,
    FindBySelector,
    Float,
    FontFamily,
    FontSize,
    MarginTop,
    MarginBottom,
    MarginRight,
    MarginLeft,
    ObjectNode,
    Path,
    PathValue,
    PaddingTop,
    PaddingBottom,
    PaddingRight,
    PaddingLeft,
    Position,
    ReturnValue,
    Tracer,
    Visibility,
    Zindex
} from "../index.mjs";


class Deserializer {
    constructor() {
    }
    /**
     * Build method deserialize(j) ,j is a JSON structure , this methode will produce a Function object
     */
    deserialize(j) {
        //add the fisrt name in the array
        var names = [j.name]
        //add the name of all descendants in the array
        var classNames = this.getClassName(j, names)
        //console.log(classNames);
        var  instances =[]
        for(const className in classNames){
            //only letters are accepted
            const validation = /^[A-Za-z]+$/;
            if(classNames[className].match(validation)){
                var functionClass = eval(classNames[className])
                instances.push(functionClass.deserialize(this, j))
            }
            // else{
            //     console.log("invalide input: " + classNames[className]);
            // }
            //console.log(functionClass);
            //console.log(functionClass.deserialize(this, j));
            //console.log(className)
             //functionClass.deserialize(this, j)
        }
        //return functionClass.deserialize(this, j) 
        //var className = j.name
        // determine  function class in the json object
        //const functionClass = eval(className)
        //console.log(functionClass);
        //return a Function object
        //return functionClass.deserialize(this, j)
        //return instances
        return instances[0];
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
            "contents": [
                {
                    "name": "GreaterThan",
                    "contents": []
                },
                {
                    "name": "ComposedFunction",
                    "contents": [
                        {
                            "name": "Opacity",
                            "contents": []
                        },
                        "$x"
                    ]
                },
                {
                    "name": "ConstantFunction",
                    "contents": [
                        {
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
console.log(c);
console.log("content of phi",c.phi.contents);

console.log(Object.values(c)[0]);
export { Deserializer };