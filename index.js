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

/**
 * Imports
 */
require("data-tree");

/**
 * Evaluates a set of conditions on a DOM tree
 * @param root A DOM node corresponding to the root of the page
 * @param conditions A list of {@link Function}, each corresponding to a
 * Boolean condition to evaluate on the page.
 * @return An array of data trees corresponding to the explanation for
 * each condition that evaluates to <tt>false</tt>.
 */
function evaluateDom(root, conditions = [])
{
	var verdicts = [];
	for (var i = 0; i < conditions.length; i++)
	{
		var verdict = getVerdict(root, conditions[i]);
		if (verdict != null)
		{
			verdicts.push(verdict);
		}
	}
	return verdicts;
}

/**
 * Evaluates a single condition on a DOM tree. <strong>This is a stub for
 * testing purposes.</strong>
 * @param root A DOM node corresponding to the root of the page
 * @param conditions A {@link Function} that corresponds to a
 * Boolean condition to evaluate on the page.
 * @return A data tree explaining the violation of the condition if it
 * evaluates to <tt>false</tt>, and <tt>null</tt> if the condition is fulfilled.
 */
function getVerdict(root, condition)
{
	if (root == null)
	{
		return null;
	}
	// Create a "fake" data tree
	var tree = dataTree.create();
	var n1 = tree.insert({
		type: "OR"});
	var n2 = tree.insertToNode(n1, {
		type: "object",
	  part: ["width"],
	  subject: "body[1]/section[2]/div[1]"});
	var n3 = tree.insertToNode(n1, {
		type: "AND"});
	var n4 = tree.insertToNode(n3, {
		type: "object",
	  part: ["characters 2-10", "text"],
	  subject: "body[1]/div[2]"});
	var n5 = tree.insertToNode(n3, "OR");
	var n6 = tree.insertToNode(n5, {
		type: "object",
	  part: ["value of"],
	  subject: "constant 100"});
	var n7 = tree.insertToNode(n5, {
		type: "object",
	  part: ["width"],
	  subject: "body[1]/section[2]/div[1]"});
	var n8 = tree.insertToNode(n3, {
		type: "object",
	  part: ["width"],
	  subject: "body[1]/section[2]/div[1]"});
	return tree;
}

/**
 * Abstract class representing all functions that extract parts of an
 * object.
 */
class Designator
{
	/**
	 * Creates a new instance of designator.
	 */
	constructor()
	{
		// Nothing to do
	}

	/**
	 * Extracts the designator at the head of a composition. For designators that
	 * are atomic, returns the designator itself.
	 */
	head()
	{
		return this;
	}

	/**
	 * Extracts the designator made of the tail of a composition. For designators
	 * that are atomic, returns null.
	 */
	tail() 
	{
		return null;
	}

	equals(o)
	{
		if (o == null || !(o instanceof Designator))
		{
			return false;
		}
		return true;
	}
}

/**
 * A special designator that designates "nothing".
 */
class Nothing extends Designator
{
	static instance = new Nothing();

	constructor()
	{
		super();
	}
	
	toString()
	{
		return "Nothing";
	}

	equals(o)
	{
		if (o == null || !(o instanceof Nothing))
		{
			return false;
		}
		return true;
	}
}

/**
 * A special designator that designates "unknown".
 */
class Unknown extends Designator
{
	static instance = new Unknown();

	constructor()
	{
		super();
	}
	
	toString()
	{
		return "Unknown";
	}

	equals(o)
	{
		if (o == null || !(o instanceof Unknown))
		{
			return false;
		}
		return true;
	}
}

/**
 * A special designator that designates all of an object.
 */
class All extends Designator
{
	static instance = new All();

	constructor()
	{
		super();
	}
	
	toString()
	{
		return "All";
	}

	equals(o)
	{
		if (o == null || !(o instanceof All))
		{
			return false;
		}
		return true;
	}
}

/**
 * Designator expressed as the composition of atomic designators.
 * @param Any number of designators
 */
class CompoundDesignator extends Designator
{
	constructor()
	{
		super();
		this.elements = [];
		for (var i = 0; i < arguments.length; i++)
		{
			this.add(arguments[i]);
		}
	}
	
	/**
	 * Adds a designator to the composition.
   	 * @param d The designator to add. If it is compound, each of its elements are
   	 * added individually. This helps keeping the compound designators "flat".
	 * If d is null, the input is simply ignored and nothing happens.
   	 */
	add(d)
	{
		if (d == null)
		{
			return;
		}
		if (d instanceof CompoundDesignator)
		{
			for (var j = 0; j < d.elements.length; j++)
			{
				this.add(d.elements[j]);
			}
		}
		else
		{
			this.elements.push(d);
		}
	}
	
	/**
	 * Gets the size (number of atomic designators) contained in this composite
	 * designator.
	 * @return The number of atomic designators
	 */
	size()
	{
		return this.elements.length;
	}
	
	head()
	{
		if (this.elements.length == 0)
		{
			return new Nothing();
		}
		return this.elements[this.elements.length - 1];
	}
	
	tail()
	{
		if (this.elements.length <= 1)
		{
			return null;
		}
		var new_d = new CompoundDesignator();
		for (var i = 0; i < this.elements.length - 1; i++)
		{
			new_d.add(this.elements[i]);
		}
		return new_d;
	}
	
	toString()
	{
		var s = "";
		for (var i = 0; i < this.elements.length; i++)
		{
			if (i > 0)
			{
				s += " of ";
			}
			s += this.elements[i].toString();
		}
		return s;
	}

	equals(o)
	{
		if (o == null || !(o instanceof CompoundDesignator))
		{
			return false;
		}
		if (o.size() != this.size())
		{
			return false;
		}
		for (var i = 0; i < this.elements.length; i++)
		{
			if (!this.elements[i].equals(o.elements[i]))
			{
				return false;
			}
		}
		return true;
	}
}

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
 * Function that checks the equality between two objects. Two objects o1 and o2
 * are equal if one of these conditions hold:
 * <ul>
 * <li>they are both null</li>
 * <li>they are both non-null and:
 * <ol>
 *   <li>they represent the same numeric value, or</li>
 *   <li>they are the same string</li>
 * </ol></li>
 * </ul>
 */
class IsEqualTo extends AtomicFunction
{
	constructor()
	{
		super(2);
	}

	getValue()
	{
		var o1 = arguments[0];
		var o2 = arguments[1];
		if (o1 == null && o2 == null)
		{
			return true;
		}
		if ((o1 == null && o2 != null) || (o1 != null && o2 == null))
		{
			return false;
		}
		if (typeof(o1) == "number" && typeof(o2) == "number")
		{
			return o1 == o2;
		}
		if (typeof(o1) == "string" && typeof(o2) == "string")
		{
			return o1 == o2;
		}
		return false;
	}
}

/**
 * Manages the nodes of a designation and-or graph.
 * @param arguments An optional stack corresponding to the tracer's context.
 */
class Tracer
{
	constructor()
	{
		/**
		 * A map keeping trace of which designated objects already have nodes.
		 */
		this.nodes = new Map();
		
		/**
		 * The context in which the tracer operates (a stack).
		 */
		this.tracerContext = [];
		if (arguments.length == 1)
		{
			this.tracerContext = arguments[0];
		}
	}

	/**
	 * Gets a new instance of an object node.
	 * @param dob The designated object that will be contained inside the node
	 * @return The object node. If an object node already exists for this
	 * designated object, it is reused. Otherwise, a new object node is created.
	 */
	getObjectNode(d, o)
	{
		if (d instanceof DesignatedObject)
		{
			var dob = d;
		}
		else
		{
			var dob = new DesignatedObject(d, o);
		}
		if (map_contains(this.nodes, dob))
		{
			return map_get(this.nodes, dob);
		}
		var on = new ObjectNode(dob);
		map_put(this.nodes, dob, on);
		return on;
	}

	/**
	 * Gets a new instance of an "and" node.
	 * @return A new "and" node
	 */
	getAndNode()
	{
		return new AndNode();
	}

	/**
	 * Gets a new instance of an "or" node.
	 * @return A new "or" node
	 */
	getOrNode()
	{
		return new OrNode();
	}

	/**
	 * Gets a new instance of an "unknown" node.
	 * @return A new "unknown" node
	 */
	getUnknownNode()
	{
		return new UnknownNode();
	}

	/**
	 * Gets an instance of a sub-tracer from this tracer.
	 * @param {Object} o An object to append at the end of the current
	 * tracer's context
	 */
	getSubTracer(o)
	{
		var con = [];
		con.push(this.tracerContext);
		con.push(o);
		return new Tracer(con);
	}

	getTree(q, d, o)
	{
		var visited = [];
		var tn = this.getObjectNode(d, o);
		this.getChildren(q, tn, visited);
		return tn;
	}

	getChildren(q, root, visited)
	{
		if (set_contains(visited, root))
		{
			// This node has already been expanded
			return;
		}
		visited.push(root);
		if (!(root instanceof ObjectNode))
		{
			// Nothing to expand
			return;
		}
		var dob = root.getObject();
		var o = dob.getObject();
		var d = dob.getDesignator();
		if (d instanceof All || d instanceof Nothing || d instanceof Unknown)
		{
			// Trivial designator: nothing to expand
			return;
		}
		if (typeof o.query == "function") // Object is queryable
		{
			// Send the query and create nodes from its result
			var leaves = o.query(q, d, root, this);
			for (var i = 0; i < leaves.length; i++)
			{
				this.getChildren(q, leaves[i], visited);
			}
		}
		else
		{
			// Query is non-trivial, and object is not trackable: nothing to do
			var n = this.getObjectNode(Unknown.instance, o);
			root.addChild(n);
		}
	}
}

/**
 * Abstract object representing a generic node in an and-or lineage graph.
 */
class TraceabilityNode
{
	/**
	 * A counter for traceability node IDs.
 	*/
	static TN_ID_COUNTER = 0;

	constructor()
	{
		/**
		 * The node's unique ID
		 */
		this.id = TraceabilityNode.TN_ID_COUNTER++;
		
		/**
		 * The node's children
		 */
		this.children = [];
	}

	/**
	 * Gets the node'is unique ID.
	 * @return The node's ID
	 */
	getId()
	{
		return this.id;
	}

	/**
	 * Adds a child to the node.
	 * @return The node to add
	 */
	addChild(n)
	{
		this.children.push(n);
	}

	/**
	 * Gets the children of this node.
	 * @return The list of children
	 */
	getChildren()
	{
		return this.children;
	}
}

/**
 * An "and" node.
 */
class AndNode extends TraceabilityNode
{
	constructor()
	{
		super();
	}

	toString()
	{
		var indent = "";
		if (arguments.length == 1)
		{
				indent = arguments[0];
		}
		var s = "";
		s += indent + "^" + "\n";
		for (var i = 0; i < this.children.length; i++)
		{
			s += indent + this.children[i].toString(indent + " ");
		}
		return s;
	}

	addChild(n)
	{
		if (n instanceof AndNode)
		{
			for (var i = 0; i < n.children.length; i++)
			{
				this.children.push(n.children[i]);
			}
		}
		else
		{
			this.children.push(n);
		}
	}
}

/**
 * An "or" node.
 */
class OrNode extends TraceabilityNode
{
	constructor()
	{
		super();
	}

	toString()
	{
		var indent = "";
		if (arguments.length == 1)
		{
				indent = arguments[0];
		}
		var s = "";
		s += indent + "v" + "\n";
		for (var i = 0; i < this.children.length; i++)
		{
			s += indent + this.children[i].toString(indent + " ");
		}
		return s;
	}

	addChild(n)
	{
		if (n instanceof OrNode)
		{
			for (var i = 0; i < n.children.length; i++)
			{
				this.children.push(n.children[i]);
			}
		}
		else
		{
			this.children.push(n);
		}
	}
}

/**
 * An "unknown" node.
 */
class UnknownNode extends TraceabilityNode
{
	constructor()
	{
		super();
	}

	toString()
	{
		return "?";
	}
}

/**
 * An "object" node.
 */
class ObjectNode extends TraceabilityNode
{
	/**
	 * Creates a new object node.
	 * @param {Designator|DesignatedObject} d The designator
	 * @param {Object} o The object that is designated
	 */
	constructor(d, o)
	{
		super();
		if (d instanceof DesignatedObject)
		{
			this.designatedObject = d;
		}
		else
		{
			this.designatedObject = new DesignatedObject(d, o);
		}
	}

	/**
	 * Gets the designated object contained inside this node.
	 */
	getDesignatedObject()
	{
		return this.designatedObject;
	}

	toString()
	{
		return this.designatedObject.toString();
	}
}

/**
 * Association between a designator, and object and an optional context.
 */
class DesignatedObject
{
	/**
	 * Creates a new designated object
 	 * @param designator The part of the object that is designated
 	 * @param object The object that is designated
	 * @param context The object's context
	 */
	constructor(designator, object, context)
	{
		/**
		 * The part of the object that is designated.
		 */
		this.designator = designator;
		
		/**
		 * The object that is designated.
		 */
		this.object = object;
		
		/**
		 * The object's context.
		 */
		if (arguments.length >= 3)
		{
			this.context = context;
		}
		else
		{
			this.context = [];
		}
	}

	/**
	 * Retrieves the designator associated to an object.
	 * @return The designator
	 */
	getDesignator()
	{
		return this.designator;
	}

	/**
	 * Retrieves the object that is being designated.
	 * @return The object
	 */
	getObject()
	{
		return this.object;
	}

	/**
	 * Retrieves the object's context.
	 * @return The context
	 */
	getContext()
	{
		return this.context;
	}

	equals(cdo)
	{
		if (cdo == null || !(cdo instanceof DesignatedObject))
		{
			return false;
		}
		return (this.object == null && cdo.object == null) ||
			(this.object != null && this.object.equals(cdo.object) &&
					this.designator.equals(cdo.designator) && this.sameContext(cdo));
	}

	/**
	 * Checks if two designated objects have the same context.
	 * @param cdo The other designated object
	 * @return <tt>true</tt> if the two objects have the same context,
	 * <tt>false</tt> otherwise
	 */
	sameContext(cdo)
	{
		if (this.context.length != cdo.context.length)
		{
			return false;
		}
		for (var i = 0; i < this.context.length; i++)
		{
			if (this.context[i] != cdo.context[i])
			{
				return false;
			}
		}
		return true;
	}

	toString()
	{
		return this.designator.toString() + " of " + this.object.toString();
	}
}

/**
 * Function that adds numbers.
 */
class Addition extends AtomicFunction
{
	constructor(arity)
	{
		super(arity);
	}

	getValue()
	{
		var sum = 0;
		for (var i = 0; i < this.arity; i++)
		{
			var o = arguments[i].getValue();
			if (typeof(o) != "number")
			{
				throw "Invalid argument type";
			}
			sum += o;
		}
		return sum;
	}

	toString()
	{
		return "Addition";
	}
}

function map_get(m, k)
{
	for (const [key, value] of m)
	{
		if (key.equals(k))
		{
			return value;
		}
	}
	return null;
}

function map_contains(m, k)
{
	for (const [key, value] of m)
	{
		if (key.equals(k))
		{
			return true;
		}
	}
	return false;
}

function map_put(m, k, v)
{
	for (const [key, value] of m)
	{
		if (key.equals(k))
		{
			m.set(key, v);
			return;
		}
	}
	m.set(k, v);
}

function set_contains(s, x)
{
	for (var i = 0; i < s.length; i++)
	{
		if (s[i].equals(x))
		{
			return true;
		}
	}
	return false;
}

/**
 * Export public API
 */
module.exports = 
{
		evaluateDom,
		All,
		AndNode,
		Addition,
		AtomicFunction,
		AtomicFunctionReturnValue,
		BooleanAnd,
		BooleanNot,
		BooleanOr,
		CompoundDesignator,
		Designator,
		DesignatedObject,
		InputArgument,
		NaryConjunctiveVerdict,
		NaryDisjunctiveVerdict,
		NaryValue,
		Nothing,
		ObjectNode,
		OrNode,
		ReturnValue,
		Tracer,
		UnknownNode,
		Value
};
// :wrap=soft:tabSize=2: