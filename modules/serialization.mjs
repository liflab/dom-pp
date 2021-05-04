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
    deserialize(j) 
    {
        const functionClass = DomPPClasses[j.name];
        return functionClass.deserialize(this, j)
    }

    serialize(s)
    {
        return s.toJson()
    }
}

export { Serialization };