//Example without jsdom

module.exports = function () {
		return "Hello World!";
};


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
		Designator.call();
};

Nothing.prototype.toString = function()
{
		return "Nothing";
};

/**
* Designator expressed as the composition of atomic designators.
* @param Any number of designators. If one of them is compound, each of
* its ad
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
		return this.elements[0];
};

CompoundDesignator.prototype.tail = function()
{
		if (this.elements.length == 0)
		{
				return Nothing();
		}
		CompoundDesignator new_d = CompundDesignator();
		for (var i = 1; i < this.elements.length; i++)
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