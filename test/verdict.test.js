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

// Chai for assertions
import pkg_chai from "chai";
import { Explainer } from "../index.mjs";
const { expect } = pkg_chai;

// Local imports
import { ComposedFunction, GreaterThan, TestCondition, TestDriver, TestResult } from "../index.mjs";

/**
 * Tests for arithmetic functions. Since none of these functions override
 * AtomicFunction#evaluate(), there is no need to check lineage. Only the
 * return values are necessary (barring a few exceptions which are listed
 * belo).
 */
describe("Verdict tests", () => {

    it("Simple condition true", async () => {
        var f = new ComposedFunction(new GreaterThan(), "@0", 50);
        var cond = new TestCondition("A condition", f);
        var driver = new TestDriver(cond);
        driver.evaluateAll(100);
        var result = driver.getResult();
        expect(result).to.be.an.instanceof(TestResult);
        expect(result.getResult()).to.be.true;
        var verdicts = result.getVerdicts();
        expect(verdicts.length).to.equal(1);
        var verdict = verdicts[0];
        var witness = verdict.getWitness();
        expect(Array.isArray(witness)).to.be.true;
        expect(witness.length).to.equal(2);
    });

    it("Simple condition false", async () => {
        var f = new ComposedFunction(new GreaterThan(), "@0", 50);
        var cond = new TestCondition("A condition", f);
        var driver = new TestDriver(cond);
        driver.evaluateAll(0);
        var result = driver.getResult();
        expect(result).to.be.an.instanceof(TestResult);
        expect(result.getResult()).to.be.false;
    });
    
});

// :wrap=soft:tabSize=2:indentWidth=2: