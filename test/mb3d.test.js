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
const { expect, timeout } = pkg_chai;

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
	Addition,
    BackgroundColor,
    BooleanAnd,
	BooleanNot,
    ClientOffsetTop,
    Color,
    ComposedFunction,
    ConstantFunction,
    DimensionHeight,
    DimensionWidth,
    Display,
    ExistentialQuantifier,
    FindBySelector,
    GreaterOrEqual,
    GreaterThan,
    IsEqualTo,
    LesserOrEqual,
    PageOffsetTop,
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

    function delay(time) {
    	return new Promise(function(resolve) {
    		setTimeout(resolve,time);
    	});
    }

    beforeEach(function() {
		mb3dPage.setViewport({ width: 1920, height: 1080 });
    });

	it("The text from .text-block should not be the same color as its background", async() => {

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

	it("The burger menu icon should not be the same color as its background after a scroll ", async() => {

		await mb3dPage.setViewport({ width: 768, height: 640 });

		await mb3dPage.evaluate(function() { window.scroll(0,300); });
		await delay(1000)

		const result = await mb3dPage.evaluate(function() {

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
	});


	/*it("Check if the .navbar-container gets wider than the viewport", async() => {

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
	});*/

	//Le test suivant permet de remplacer la vérification du viewport ?

	it("The body width and scrollWidth should always be the same", async() => {

		await mb3dPage.setViewport({ width: 320, height: 640 })

		const result = await mb3dPage.evaluate(function() {

			let body = document.querySelector(".body");
			let scrollwidth = body.scrollWidth;

			let f = new dompp.ComposedFunction(
				new dompp.IsEqualTo(),
				new dompp.ComposedFunction(new dompp.DimensionWidth(), "$x"),
			 	scrollwidth
			)

			let cond = new dompp.TestCondition(".body width <= body scrollwidth", f);
			let result = cond.evaluate(body).getValue();
			return result;
		});

		expect(result).to.equal(true);
	});

	it("The two versions of the logo in the navbar should not be visible at the same time", async() => {

		await mb3dPage.evaluate(function() { window.scroll(0,300); });
		await mb3dPage.evaluate(function() { window.scroll(0,0); });
		await delay(1000);

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

	//Besoin de la gestion de l'hérédité

	it("Check that the logo wont go under the hero h2", async() => {

		await mb3dPage.evaluate(function() { window.scroll(0,300); });
		await delay(500);
		const result = await mb3dPage.evaluate(function() {

			// let body = document.querySelector(".body");
			// let f = new dompp.ExistentialQuantifier(
			// 	"$x",
			// 	new dompp.FindBySelector(".logo-img.scroll"),
			// 	new dompp.ExistentialQuantifier(
			// 		"$y",
			// 		new dompp.FindBySelector(".h2-hero"),
			// 		new dompp.ComposedFunction(
			// 			new dompp.GreaterOrEqual(),
			// 			new dompp.ComposedFunction(new dompp.Zindex(), "$x"),
			// 			new dompp.ComposedFunction(new dompp.Zindex(), "$y")
			// 		)
			// 	)

			// )

			// let cond = new dompp.TestCondition(".logo-img.scroll z-index > .h2-hero z-index", f);
			// let result = cond.evaluate(body).getValue();
			let logo = document.querySelector(".h2-hero");
			let f = new dompp.Zindex();
			let result = f.evaluate(logo).getValue();

			window.scrollTo(0,0);
			return result;
		});

		// let logo = document.querySelector(".h2-hero");
		// let f = new Zindex();
		// let result = f.evaluate(logo).getValue();

		expect(result).to.equal(true);
	});

	it("After using the arrow button to scroll to the next section, navbar should not be on top of the section", async() => {

		await mb3dPage.click(".hero-wrapper .fleche-container a");
		await delay(1200);

		const result = await mb3dPage.evaluate(function() {

			let navbar = document.querySelector(".section-courant");
			let body = document.querySelector(".body");
			let f = new dompp.ExistentialQuantifier(
				"$x",
				new dompp.FindBySelector(".navbar-container"),
				new dompp.ExistentialQuantifier(
					"$y",
					new dompp.FindBySelector(".section-courant"),
					new dompp.ComposedFunction(
						new dompp.LesserOrEqual(),
						new dompp.ComposedFunction(
							new dompp.Addition(),
							new dompp.ComposedFunction(new dompp.ClientOffsetTop(), "$x"),
							new dompp.ComposedFunction(new dompp.DimensionHeight(), "$x")
						),
						new dompp.ComposedFunction(new dompp.ClientOffsetTop(), "$y")
					)
				)
			);

			let cond = new dompp.TestCondition(".navbar-container clientOffsetTop + height <= .section-courant clientOffsetTop", f);
			let result = cond.evaluate(body).getValue();
			return result;
		});

		expect(result).to.equal(true);
	});

	it("All navigation links should have the same top offset", async() => {

		const result = await mb3dPage.evaluate(function() {

			let body = document.querySelector(".body");
			let f = new dompp.UniversalQuantifier(
				"$x",
				new dompp.FindBySelector(".nav-link"),
				new dompp.UniversalQuantifier(
					"$y",
					new dompp.FindBySelector(".nav-link"),
					new dompp.ComposedFunction(
						new dompp.IsEqualTo(),
						new dompp.ComposedFunction(new dompp.PageOffsetTop(), "$x"),
						new dompp.ComposedFunction(new dompp.PageOffsetTop(), "$y")
					)
				)
			);

			let cond = new dompp.TestCondition("for all pairs (x,y) of .nav-link, x pageOffsetTop = y pageOffsetTop", f);
			let result = cond.evaluate(body).getValue();
			return result;
		});

		expect(result).to.equal(true);
	});

	it("After scrolling, the navbar background should be white", async() => {

		await mb3dPage.evaluate(function() { window.scroll(0,300); });
		await delay(1000);

		const result = await mb3dPage.evaluate(function() {

			let body = document.querySelector(".body");
			let f = new dompp.ExistentialQuantifier(
				"$x",
				new dompp.FindBySelector(".navbar-container"),
				new dompp.ComposedFunction(
					new dompp.IsEqualTo(),
					new dompp.ComposedFunction(new dompp.BackgroundColor(), "$x"),
					new dompp.ConstantFunction("rgb(255, 255, 255)")
				)
			)

			let cond = new dompp.TestCondition(".navbar-container background color = rgb(255, 255, 255)", f);
			let result = cond.evaluate(body).getValue();
			window.scroll(0,0);
			return result;
		});
		//expect(false).to.equal(true);
		expect(result).to.equal(true);
	});

	after(async function() {
        //await terminate_puppeteer_browser();
    })
});