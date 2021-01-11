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
 * Abstract class representing all functions that extract parts of an
 * object.
 */
function Designator()
{
	// Nothing to do in this top level object
};

/**
 * Extracts the designator at the head of a composition. For designators that
 * are atomic, returns the designator itself.
 */
Designator.prototype.head = function()
{
	return this;
};

/**
 * Extracts the designator made of the tail of a composition. For designators
 * that are atomic, returns the special designator {@link Nothing}.
 */
Designator.prototype.tail = function()
{
	return Nothing();
};

/**
 * A special designator that designates "nothing".
 */
function Nothing()
{
	Designator.call(this);
};

Nothing.prototype.toString = function()
{
	return "Nothing";
};

/**
 * A special designator that designates all of an object.
 */
function All()
{
	Designator.call(this);
};

All.prototype.toString = function()
{
	return "All";
};

/**
 * Designator expressed as the composition of atomic designators.
 * @param Any number of designators
 */
function CompoundDesignator()
{
	this.elements = [];
	for (var i = 0; i < arguments.length; i++)
	{
		this.add(arguments[i]);
	}
};

/**
 * Adds a designator to the composition.
 * @param d The designator to add. If it is compound, each of its elements are
 * added individually. This helps keeping the compound designators "flat".
 */
CompoundDesignator.prototype.add = function(d)
{
	if (d instanceof CompoundDesignator)
	{
		for (var j = 0; j < d.elements.length; j++)
		{
			this.elements.push(d.elements[j]);
		}
	}
	else
	{
		this.elements.push(d);
	}
};

/**
 * Gets the size (number of atomic designators) contained in this composite
 * designator.
 * @return The number of atomic designators
 */
CompoundDesignator.prototype.size = function()
{
	return this.elements.length;
};

CompoundDesignator.prototype.head = function()
{
	if (this.elements.length == 0)
	{
		return Nothing();
	}
	return this.elements[this.elements.length - 1];
};

CompoundDesignator.prototype.tail = function()
{
	if (this.elements.length == 0)
	{
		return All();
	}
	if (this.elements.length == 1)
	{
		return this.elements[0];
	}
	CompoundDesignator new_d = CompundDesignator();
	for (var i = 0; i < this.elements.length - 1; i++)
	{
		new_d.add(this.elements[i]);
	}
	return new_d;
};

CompoundDesignator.prototype.toString = function()
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
};

// :wrap=soft:tabSize=2: