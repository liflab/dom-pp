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
const { expect } = require("chai");
const chai = require("chai");
const plugin = require("..");

/**
 * Local namespace imports
 */
All = plugin.All;

describe("Designator tests", () => {

	describe("Compound designator", () => {
		it("Head and tail", () => {
			var all = new plugin.All();
			console.log(all);
			var d = new plugin.CompoundDesignator(all);
			console.log(d);
			expect(d.head()).to.equal(all);
		});
	});
});


// :wrap=soft:tabSize=2:indentWidth=2: