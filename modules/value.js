// Local imports
import {Designator} from "./designator.js";

/**
 * Object produced by the call(this) to a function, and whose lineage
 * can be computed.
 */
class Value
{
	constructor()
	{
		// Nothing to do
	}

	/**
	 * Gets the concrete value carried by this Value object.
	 * @return The value
	 */
	getValue()
	{
		// To be overridden by descendants
		return null;
	}

	/**
	 * Queries the provenance of a value.
	 * @param type The type of lineage relationship
	 * @param d A designator representing the part of the object that is the
	 * subject of the query
	 * @param root The node to which the rsults of the query should be appended
	 * as children
	 * @param A factory to produce traceability nodes
	 * @return The list of terminal traceability nodes produced by this query
	 */
	query(type, d, root, factory)
	{
		// To be overridden by descendants
	}

	/**
	 * Converts an arbitrary object into a {@link Value}.
	 * @param o The object to convert. If o is a {@link Value}, it is returned as
	 * is. Otherwise, o is converted into a {@link ConstantValue} that returns o.
	 * @return The converted value
	 */
	static lift(o)
	{
		if (o instanceof Value)
		{
			return o;
		}
		return new ConstantValue(o);
	}
}

/**
 * Value that is linked to a list of other values. This class is the
 * ancestor used for values produced by most n-ary atomic functions.
 */
class NaryValue extends Value
{
	/**
	 * Creates a new instance of this value.
	 * @param {Object} value The value to produce
	 * @param {Array} values An array of {@link Value}s that are linked to
	 * this value
	 */
	constructor(value, values = [])
	{
		super();
		this.value = value;
		this.values = values;
	}

	getValue()
	{
		return this.value;
	}
}

/**
 * Special type of value that always returns the same constant.
 * @param o The constant to return
 */
class ConstantValue extends Value
{
	constructor(o)
	{
		super();

		/**
		 * The value represented by this constant
		 */
		this.value = o;
	}

	getValue()
	{
		return this.value;
	}

	toString()
	{
		return this.value.toString();
	}

	equals(o)
	{
		if (o == null || !(o instanceof Value))
		{
			return false;
		}
		return o.getValue() == this.value;
	}
}
/**
 * Atomic designator that points to the value of a constant.
 */
class ConstantDesignator extends Designator
{
	constructor()
	{
		super();
	}

	toString()
	{
		return "Value";
	}
}

/**
 * Package exports
 */
export {ConstantValue, NaryValue, Value};