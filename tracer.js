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
 * Manages the nodes of a designation and-or graph.
 * @param arguments An optional stack corresponding to the tracer's context.
 */
function Tracer()
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
};

/**
 * Gets a new instance of an object node.
 * @param dob The designated object that will be contained inside the node
 * @return The object node. If an object node already exists for this
 * designated object, it is reused. Otherwise, a new object node is created.
 */
Tracer.prototype.getObjectNode = function(dob)
{
	if (map_contains(this.nodes, dob))
	{
		return map_get(this.nodes, dob);
	}
	var on = ConcreteObjectNode(dob);
	map_put(this.nodes, dob, on);
	return on;
};

/**
 * Gets a new instance of an "and" node.
 * @return A new "and" node
 */
Tracer.prototype.getAndNode = function()
{
	return AndNode();
};

/**
 * Gets a new instance of an "or" node.
 * @return A new "or" node
 */
Tracer.prototype.getOrNode = function()
{
	return OrNode();
};

/**
 * Gets a new instance of an "unknown" node.
 * @return A new "unknown" node
 */
Tracer.prototype.getUnknownNode = function()
{
	return UnknownNode();
};

/**
 * A counter for traceability node IDs.
 */
TN_ID_COUNTER = 0;

/**
 * Abstract object representing a generic node in an and-or lineage graph.
 */
function TraceabilityNode()
{
	/**
	 * The node's unique ID
	 */
	this.id = TN_ID_COUNTER++;
	
	/**
	 * The node's children
	 */
	this.children = [];
};

/**
 * Gets the node'is unique ID
 * @return The node's ID
 */
TraceabilityNode.getId = function()
{
	return this.id;
};

/**
 * Adds a child to the node
 * @return The node to add
 */
TraceabilityNode.addChild = function(n)
{
	this.children.push(n);
};

/**
 * An "and" node.
 */
function AndNode()
{
	// Inherit from TraceabilityNode
	TraceabilityNode.call();
};

AndNode.prototype.toString = function()
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

AndNode.prototype.addChild = function(n)
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
};

/**
 * An "or" node.
 */
function OrNode()
{
	// Inherit from TraceabilityNode
	TraceabilityNode.call();
};

OrNode.prototype.toString = function()
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

OrNode.prototype.addChild = function(n)
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
};

/**
 * An "unknown" node.
 */
function UnknownNode()
{
	// Inherit from TraceabilityNode
	TraceabilityNode.call();
};

UnknownNode.prototype.toString = function()
{
	return "?";
};

/**
 * Association between a designator, and object and an optional context.
 * {@link ObjectNodes} in a lineage graph contain designated objects.
 * @param designator The part of the object that is designated
 * @param object The object that is designated
 * @param context The object's context
 */
function DesignatedObject(designator, object, context)
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
};

/**
 * Retrieves the designator associated to an object.
 * @return The designator
 */
DesignatedObject.prototype.getDesignator()
{
	return this.designator;
};

/**
 * Retrieves the object that is being designated.
 * @return The object
 */
DesignatedObject.prototype.getObject()
{
	return this.object;
};

/**
 * Retrieves the object's context.
 * @return The context
 */
DesignatedObject.prototype.getContext()
{
	return this.context;
};

DesignatedObject.prototype.equals(cdo)
{
	if (cdo == null || !(cdo instanceof DesignatedObject))
	{
		return false;
	}
	return (this.object == null && cdo.object == null)
		|| (this.object != null && this.object.equals(cdo.object)
				&& this.designator.equals(cdo.designator) && sameContext(cdo));
};

/**
 * Checks if two designated objects have the same context.
 * @param cdo The other designated object
 * @return <tt>true</tt> if the two objects have the same context,
 * <tt>false</tt> otherwise
 */
DesignatedObject.prototype.sameContext = function(cdo)
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
};
// :wrap=soft:tabSize=2: