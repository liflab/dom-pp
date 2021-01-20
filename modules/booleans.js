/*
  A lineage library for DOM nodes
  MIT License
  
  Copyright (c) 2020-2021 Amadou Ba, Sylvain Hallé
  Eckinox Média and Université du Québec à Chicoutimi
  
  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:
  
  The above copyright notice and this permission notice shall be included in all
  copies or substantial portions of the Software.
  
  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  SOFTWARE.
*/

// Local imports
import {AtomicFunction} from "./atomic-function.js";
import {NaryValue} from "./value.js";

/**
 * Abstract class representing the binary Boolean connectives "and" and "or".
 */
class BooleanConnective extends AtomicFunction
{
	constructor(arity)
	{
		super(arity);
	}

	compute()
	{
		var false_values = [];
		var true_values = [];
		for (var i = 0; i < arguments.length; i++)
		{
			var o = values[i].getValue();
			if (typeof(o) != "boolean")
			{
				throw "Invalid argument type";
			}
			if (o == true)
			{
				true_values.push(values[i]);
			}
			else
			{
				false_values.push(values[i]);
			}
		}
		return this.getBooleanValue(false_values, true_values);
	}
}

/**
 * An {@link NaryValue} that is linked to its input values through an "or"
 * node.
 */
class NaryDisjunctiveVerdict extends NaryValue
{
	constructor(value, values = [])
	{
		super(value, values);
	}

	query(q, d, root, factory)
	{
		var leaves = [];
		var n = factory.getOrNode();
		for (var i = 0; i < this.values.length; i++)
		{
			var v = this.values[i];
			leaves.push(v.query(q, ReturnValue.instance, n, factory));
		}
		if (n.getChildren().length == 1)
		{
			root.addChild(n.getChildren()[0]);
		}
		else
		{
			root.addChild(n);
		}
		return leaves;
	}
}

/**
 * An {@link NaryValue} that is linked to its input values through an "and"
 * node.
 */
class NaryConjunctiveVerdict extends NaryValue
{
	constructor(value, values = [])
	{
		super(value, values);
	}

	query(q, d, root, factory)
	{
		var leaves = [];
		var n = factory.getAndNode();
		for (var i = 0; i < this.values.length; i++)
		{
			var v = this.values[i];
			leaves.push(v.query(q, ReturnValue.instance, n, factory));
		}
		if (n.getChildren().length == 1)
		{
			root.addChild(n.getChildren()[0]);
		}
		else
		{
			root.addChild(n);
		}
		return leaves;
	}
}

/**
 * The Boolean "and" function.
 */
class BooleanAnd extends BooleanConnective
{
	constructor(arity = 2)
	{
		super(arity);
	}

	getBooleanValue(false_values = [], true_values = [])
	{
		if (false_values.length == 0)
		{
			return new NaryConjunctiveVerdict(true, true_values);
		}
		return new NaryDisjunctiveVerdict(false, false_values);
	}

	toString()
	{
		return "And";
	}
}

/**
 * The Boolean "or" function.
 */
class BooleanOr extends BooleanConnective
{
	constructor(arity = 2)
	{
		super(arity);
	}

	getBooleanValue(false_values = [], true_values = [])
	{
		if (true_values.length == 0)
		{
			return new NaryConjunctiveVerdict(false, false_values);
		}
		return new NaryDisjunctiveVerdict(true, true_values);
	}

	toString()
	{
		return "Or";
	}
}

/**
 * The Boolean "not" function.
 */
class BooleanNot extends BooleanConnective
{
	constructor()
	{
		super(1);
	}

	getValue()
	{
		if (typeof(arguments[0]) != "boolean")
		{
			throw "Invalid argument type";
		}
		return !arguments[0];
	}

	toString()
	{
		return "Not";
	}
}

/**
 * Package exports
 */
export {BooleanAnd, BooleanNot, BooleanOr, NaryConjunctiveVerdict, NaryDisjunctiveVerdict};