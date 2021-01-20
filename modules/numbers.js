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

/**
 * Package exports
 */
export {Addition, IsEqualTo};