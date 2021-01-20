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
 * Module exports
 */
export {Designator, All, Nothing, CompoundDesignator};