// Local imports
import {CompoundDesignator} from "./designator.js";
import {AbstractFunction, InputArgument} from "./function.js";
import {Value} from "./value.js";

/**
 * Function that performs a direct computation on its input arguments. This is
 * opposed to a {@link ComposedFunction} that call(this)s other functions to produce
 * its return value.
 * @param arity The input arity of the function
 */
class AtomicFunction extends AbstractFunction
{
	constructor(arity)
	{
		super();

		/**
		 * The input arity of the function
		 */
		this.arity = arity;
	}

	evaluate()
	{
		var values = [];
		for (var i = 0; i < arguments.length; i++)
		{
			values[i] = Value.lift(arguments[i]);
		}
		return this.compute(...values);
	}

	/**
	 * Computes the return value of the function from its input arguments.
	 * @param arguments A variable number of {@link Values}, whose number
	 * must match the input arity of the function.
	 * @return The resulting {@link Value}
	 */
	compute()
	{
		if (arguments.length != this.arity)
		{
			throw "Invalid number of arguments";
		}
		var args = [];
		for (var i = 0; i < arguments.length; i++)
		{
			args[i] = arguments[i];
		}
		var o = this.getValue(...args);
		if (o instanceof Value)
		{
			return o;
		}
		return new AtomicFunctionReturnValue(this, o, ...arguments);
	}

	getValue()
	{
		// To be overridden by descendants
		return null;
	}

}

/**
 * Value obtained as the output produced by an atomic function call(this).
 */
class AtomicFunctionReturnValue extends Value
{
	/**
 	 * Creates a new value
 	 * @param arguments An output value followed by the function's input arguments
 	 */
	constructor()
	 {
		super();

		/**
		 * The function instance this value comes from
		 */
		this.referenceFunction = arguments[0];

		/**
		 * The output value produced by the function
		 */
		this.outputValue = arguments[1];

		/**
		 * The function's input arguments
		 */
		this.inputValue = [];
		for (var i = 2; i < arguments.length; i++)
		{
			this.inputValue.push(arguments[i]);
		}
	}

	getValue()
	{
		return this.outputValue;
	}

	toString()
	{
		return this.outputValue.toString();
	}

	/*@Override*/
	query(type, d, root, factory)
	{
		var leaves = [];
		var n = factory.getAndNode();
		for (var i = 0; i < this.inputValue.length; i++)
		{
			if (this.inputValue[i] == null)
			{
				continue;
			}
			var new_d = new CompoundDesignator(d.tail(), new InputArgument(i));
			var sub_root = factory.getObjectNode(new_d, this.referenceFunction);
			var sub_leaves = [];
			sub_leaves = this.inputValue[i].query(type, d, root, factory);
			leaves.push(sub_leaves);
			n.addChild(sub_root);
		}
		var f_root = factory.getObjectNode(d, this.referenceFunction);
		if (n.getChildren().length == 1)
		{
			f_root.addChild(n.getChildren()[0]);
		}
		else
		{
			f_root.addChild(n);
		}
		root.addChild(f_root);
		return leaves;
	}
}

/**
 * Package exports
 */
export {AtomicFunction, AtomicFunctionReturnValue};