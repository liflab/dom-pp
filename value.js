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
 * Object produced by the call(this) to a function, and whose lineage
 * can be computed.
 */
function Value()
{
	// Nothing to do in this top level object
};

/**
 * Gets the concrete value carried by this Value object.
 * @return The value
 */
Value.prototype.getValue = function()
{
	// To be overridden by descendants
	return null;
};

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
Value.prototype.query = function(type, d, root, factory)
{
	// To be overridden by descendants
};

/**
 * Converts an arbitrary object into a {@link Value}.
 * @param o The object to convert. If o is a {@link Value}, it is returned as
 * is. Otherwise, o is converted into a {@link ConstantValue} that returns o.
 * @return The converted value
 */
Value.prototype.lift = function(o)
{
	if (o instanceof Value)
	{
		return o;
	}
	return ConstantValue(o);
};

/**
 * Special type of value that always returns the same constant.
 * @param o The constant to return
 */
function ConstantValue(o)
{
		// Descent from Value
		Value.call(this);
		
		/**
		 * The value represented by this constant
		 */
		this.value = o;
};

ConstantValue.prototype.getValue = function()
{
	return this.value;
};

ConstantValue.prototype.toString = function()
{
	return this.value.toString();
};

/**
 * Atomic designator that points to the value of a constant.
 */
function ConstantDesignator()
{
	AtomicDesignator.call(this);
};

ConstantDesignator.prototype.toString = function()
{
	return "Value";
};

// :wrap=soft:tabSize=2: