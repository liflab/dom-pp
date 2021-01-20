// Local imports
import { Designator } from "./designator.js";

/**
 * Abstract class representing a function.
 */
class AbstractFunction
 {
	constructor()
	{
		// Nothing to do
	}

	/**
	 * Computes the return value of the function from its provided input
	 * arguments.
	 * @param arguments A variable number of input arguments
	 * @return The return value of the function
	 */
	evaluate()
	{
		// To be overridden by descendants
		return null;
	}

	/**
	 * Converts an arbitrary object into a {@link Function}.
	 * @param o The object to convert. If o is a function, it is returned as is.
	 * Otherwise, o is converted into a {@link ConstantFunction} that returns
	 * the {@link Value} lifted from o.
	 * @return The converted function
	 */
	lift(o) 
	{
		if (o instanceof AbstractFunction)
		{
			return o;
		}
		return ConstantFunction(Value.prototype.lift(o));
	}

	/**
	 * Binds a variable name to a specific value.
	 * @param variable The name of the variable
	 * @param value The value to bind this variable to
	 */
	setTo(variable, value) 
	{
		// To be overridden by descendants
	}

	/**
	 * Gets the arity of the function.
	 * @return The arity
	 */
	getArity()
	{
		return 0;
	}

	equals(o)
	{
		if (o == null || !(o instanceof AbstractFunction))
		{
			return false;
		}
		return typeof(o) == typeof(this);
	}
}

/**
 * Atomic designator representing the return value of a function.
 */
class ReturnValue extends Designator
 {
	static instance = new ReturnValue();

	constructor()
	{
		super();
	}

	toString()
	{
		return "!";
	}
}

/**
 * Atomic designator representing one of the input arguments of a function.
 * @param index The index of the input argument
 */
class InputArgument extends Designator
{
	constructor(index)
	{
		super();

		/**
		 * The index of the input argument
		 */
		this.index = index;
	}

	toString()
	{
		return "@" + this.index;
	}
}

/**
 * Module exports
 */
export {AbstractFunction, InputArgument, ReturnValue};