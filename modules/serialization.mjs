import * as DomPPClasses from "../index.mjs";

class Serialization
{
    constructor() 
    {
    }

    /**
     * Build method deserialize(j), j is a JSON structure,
     * this method will produce a Function object
     */
    deserialize(j) {
        var functionClass = DomPPClasses[j.name];
        return functionClass.deserialize(this, j)
    }

    serialize(s){
        var functionClass = DomPPClasses[s.constructor.name];
        return functionClass.toJson(s)
    }
}

export { Serialization };