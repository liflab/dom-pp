/*
	A lineage library for DOM nodes
	MIT License
  
	Copyright (c) 2020-2021 Florent Dumoulin, Sylvain Hallé
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
const { expect } = pkg_chai;

// JSDOM for DOM trees
import pkg_jsdom from "jsdom";
const { JSDOM } = pkg_jsdom;
import "jsdom-global";

// DataTree for tree management
import pkg_datatree from "data-tree";
const { dataTree } = pkg_datatree;

// Utilities
import { load_dom, load_file_in_puppeteer, terminate_puppeteer_browser } from "./test-util.mjs";

//  Get tree from witness
import {
	getVerdict,
	evaluateDom,
    BackgroundColor,
    BooleanAnd,
	BooleanNot,
    Color,
    ComposedFunction,
    ConstantFunction,
    DimensionWidth,
    Display,
    ExistentialQuantifier,
    FindBySelector,
    GreaterOrEqual,
    GreaterThan,
    IsEqualTo,
    LesserOrEqual,
    TestCondition,
    UniversalQuantifier,
    Zindex
} from "../index.mjs";

// /////////// Extra imports for the reading of css files//////////////////////////////////
import * as fs from 'fs'
import * as path from 'path'
const __dirname = path.dirname(new URL(
    import.meta.url).pathname);
// /////////// End Extra ///////////////////

let mb3dPage;
mb3dPage = await load_file_in_puppeteer("./test/mb3d/index.html");
mb3dPage.setViewport({ width: 1920, height: 1080 })

describe("Checking for bugs on MB3D using DOM-PP", () => {

	const dom = fs.readFileSync('./test/mb3d/index.html', 'utf-8')
    const url = `file://${__dirname}/mb3d/index.html`
    const { window } = new JSDOM(dom, { resources: 'usable', url: url })
    const { document } = window

	it("Text having the same color as his background", async() => {

		let selector = ".text-block";
		let currentElem = document.querySelector(selector);
		let g = new BackgroundColor();
		let bgColor = g.evaluate(currentElem).getValue();

		while(bgColor == "" || bgColor == "transparent" || bgColor == "rgba(0, 0, 0, 0)")
		{
			currentElem = currentElem.parentElement;
			bgColor = g.evaluate(currentElem).getValue();
		}

		let body = document.body;
		let f = new UniversalQuantifier(
			"$x",
			new FindBySelector(selector),
			new ComposedFunction(
				new BooleanNot(),
				new ComposedFunction(
					new IsEqualTo(),
					new ComposedFunction(new Color(), "$x"),
					new ConstantFunction(bgColor)
				)
			)
		)


		let cond = new TestCondition(".text-block color != body backgroundColor", f);
		let tree = getVerdict(body, cond);
		//console.log(tree);
		expect(tree).to.equal(null);
	});

	it("Check that burger menu icon color is not the same as the navbar bakground", async() => {

		await mb3dPage.setViewport({ width: 768, height: 640 });

		const result = await mb3dPage.evaluate(function() {

			window.scroll(0,500);

			let body = document.querySelector(".body");
			let f = new dompp.ExistentialQuantifier(
				"$x",
				new dompp.FindBySelector(".navbar-container"),
				new dompp.ExistentialQuantifier(
					"$y",
					new dompp.FindBySelector(".w-icon-nav-menu"),
					new dompp.ComposedFunction(
						new dompp.BooleanNot(),
						new dompp.ComposedFunction(
							new dompp.IsEqualTo(),
							new dompp.ComposedFunction(new dompp.BackgroundColor(), "$x"),
							new dompp.ComposedFunction(new dompp.Color(), "$y")
						)
					)
				)
			)

			let cond = new dompp.TestCondition(".navbar-container backgroundColor != w-icon-nav-menu color", f);
			let result = cond.evaluate(body).getValue();
			window.scroll(0,0);
			return result;
		});

		expect(result).to.equal(true);
        await mb3dPage.setViewport({ width: 1920, height: 1080 });
	});

	it("Check if the .navbar-container gets wider than the viewport", async() => {

		await mb3dPage.setViewport({ width: 320, height: 640 })
		await mb3dPage.screenshot({ path: 'screen1.png' })
		const result = await mb3dPage.evaluate(function() {
			let navbar = document.querySelector(".navbar-container");
			let f = new dompp.ComposedFunction(
				new dompp.LesserOrEqual(),
				new dompp.ComposedFunction(new dompp.DimensionWidth(), "$x"),
				320
			)

			let cond = new dompp.TestCondition(".navbar-container width <= viewport", f);
			let result = cond.evaluate(navbar).getValue();
			return result;
		});

		expect(result).to.equal(true);
        await mb3dPage.setViewport({ width: 1920, height: 1080 })
	});

	it("Check that the two logos are not visible at the same time", async() => {

		const result = await mb3dPage.evaluate(function() {

			let body = document.querySelector(".body");
			let f = new dompp.ExistentialQuantifier(
				"$x",
				new dompp.FindBySelector(".logo-img:first-child"),
				new dompp.ExistentialQuantifier(
					"$y",
					new dompp.FindBySelector(".logo-img.scroll"),
					new dompp.ComposedFunction(
						new dompp.BooleanNot(),
						new dompp.ComposedFunction(
							new dompp.BooleanAnd(),
							new dompp.ComposedFunction(
								new dompp.IsEqualTo(),
								new dompp.ComposedFunction(new dompp.Display(), "$x"),
								new dompp.ConstantFunction("block")
							),
							new dompp.ComposedFunction(
								new dompp.IsEqualTo(),
								new dompp.ComposedFunction(new dompp.Display(), "$y"),
								new dompp.ConstantFunction("inline-block")
							)
						)
					)
				)
			)

			let cond = new dompp.TestCondition("!(.logo-img display == block && .logo-img.scroll display == inline-block)", f);
			let result = cond.evaluate(body).getValue();
			return result;
		});

		expect(result).to.equal(true);
	});

	it("Check that the logo wont go under the hero h2", async() => {

		const result = await mb3dPage.evaluate(function() {

			window.scrollTo(0,200);

			let body = document.querySelector(".body");
			let f = new dompp.ExistentialQuantifier(
				"$x",
				new dompp.FindBySelector(".logo-img.scroll"),
				new dompp.ExistentialQuantifier(
					"$y",
					new dompp.FindBySelector(".h2-hero"),
					new dompp.ComposedFunction(
						new dompp.GreaterOrEqual(),
						new dompp.ComposedFunction(new dompp.Zindex(), "$x"),
						new dompp.ComposedFunction(new dompp.Zindex(), "$y")
					)
				)

			)

			let cond = new dompp.TestCondition(".logo-img.scroll z-index > .h2-hero z-index", f);
			let result = cond.evaluate(body).getValue();
			window.scrollTo(0,0);
			return result;
		});

		expect(result).to.equal(true);
	});

	it("Test scroll puppeteer", async() => {

		await mb3dPage.screenshot({ path: 'screen2.png' })
		await mb3dPage.evaluate(function() {
			window.scrollTo(0,200);
		});
		setTimeout(function() {}, 1000);
		await mb3dPage.screenshot({ path: 'screen3.png' })
		await mb3dPage.screenshot({ path: 'screen4.png' })
		const result = await mb3dPage.evaluate(function() {
			var navbar = document.querySelector(".navbar-container");
			var g = new dompp.BackgroundColor();
			var result = g.evaluate(navbar);
			return result;
		});
	});


	after(async function() {
        //await terminate_puppeteer_browser();
    })
});