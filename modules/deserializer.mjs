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
        //only letters are accepted
        const validation = /^[A-Za-z]+$/;
        if (j.name.match(validation)) {
            var functionClass = eval(j.name)
            return functionClass.deserialize(this, j)
        }

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
var jsonObj = []
function toJson(result) {
    var jsonData = {"name": result.name, "contents": result.members}
    if(jsonData.contents !== []){
        for (let index = 0; index < jsonData.contents.length; index++) {
            if (typeof jsonData.contents[index] == "object") {
                //tempory save the value of the value
                var temp = jsonData.contents[index]
                //create json object
                jsonData.contents[index] = {"name": jsonData.contents[index].constructor.name, "contents": jsonData.contents[index].members} 
                toJson(temp)
            }   
        }
    }
    if(jsonData.name == undefined ) jsonData.name = result.constructor.name
    return jsonData
}

var c = new Deserializer().deserialize(j)
//console.log(c);
console.log(toJson(c));
//var a = toJson(c)
//console.log(a[0].contents.FindBySelector);
//console.log(c.phi.operands[1]);
//console.log(Object.values(c))

//console.log(toJson(c))

console.log("==============================");
//console.log(c.members[0])
// console.log(c.members[1].members)
//console.log(c.members[2])
//console.log(c.members[2].members[1][0])
// console.log(c.members[2].members[1][1])

export { Deserializer };