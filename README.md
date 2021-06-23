A flexible assertion framework for web pages
============================================

![Build status](https://api.travis-ci.org/liflab/dom-pp.svg?branch=main)
[SonarCloud Dashboard](https://sonarcloud.io/dashboard?id=liflab_dom-pp)

DOM-PP is a library for writing assertions about elements in a web page.
It complements classical unit libraries such as
[Mocha](https://mochajs.org/) and [JSDOM](https://github.com/jsdom/jsdom)
in three ways:

1. Conditions can be written at a higher level of abstraction, using a
   range of predefined functions including quantifiers and path selectors
2. When a condition fails, DOM-PP returns a result that provides a
   detailed explanation of *what* elements of the page cause the error, and
   *why*.
3. Conditions are *objects* instead of code, which means they can manipulated
   and passed as arguments.

An example
----------

To illustrate the use of DOM-PP, suppose you want to check this simple
condition through a unit test:

> "All items of list `#mylist` must have a width of at least 100 pixels"

Doing so with DOM-PP, in conjunction with Mocha and JSDOM, goes as follows:

```javascript
var dom = ... // Load page
var cond = TestCondition.create(
  ForAll("$x", "#mylist>li", IsGreaterThan(Width("$x"), 100)));
expectVerdict(cond.evaluate(dom));
```

Without DOM-PP, the condition would need to be written as plain JS code:

```javascript
var dom = ... // Load page
var elements = dom.querySelectorAll("#mylist>li");
for (let i = 0; i < elements.length; i++) {
  var win = this.getOwnerWindow(elements[i]);
  expect(win.getComputedStyle(elements[i]).getPropertyValue("width")).to.be.above(100);
}
```

This does not represent much more code in this simple example, but the DOM-PP
condition arguably conveys the developer's intent at a higher level of
abstraction than the second option.

In both cases, the only result you get, in case of an error, is that there is
an error. It would be much more useful if the test could at least point to the
elements that cause the error --for example by providing their path in the
page. In DOM-PP, you do:

```javascript
var dom = ... // Load page
var cond = TestCondition.create(
  ForAll("$x", "#mylist>li", IsGreaterThan(Width("$x"), 100)));
expectVerdict(cond.evaluate(dom)).showWitnesses();
```

THe only addition is the call to `showWitnesses()` at the end of `expectVerdict`.
Suppose that the second and third element of the list violate the condition; this
would produce the following output:

```
Width of #mylist/li[2]
Width of #mylist/li[3]
```

How do you get this in plain Mocha? Since a test stops at the first error, one
must modify the code as follows:

```javascript
var dom = ... // Load page
var elements = dom.querySelectorAll("#mylist>li");
var errors = [];
for (let i = 0; i < elements.length; i++) {
  var win = this.getOwnerWindow(elements[i]);
  if (win.getComputedStyle(elements[i]).getPropertyValue("width")) {
    errors.push("Width of " + elements[i]);
  }
}
for (let i = 0; i < errors.length; i++) {
  console.log(errors[i]);
}
expect(errors.length).to.equal(0);
```

Things are getting slightly more involved --and note that this code snippet does
not even print the actual CSS selector corresponding to each faulty element, but
rather the element's *name*. Getting the element's path would require yet a few
more lines of code. Also note that the feedback hardcodes the "width of" string,
whereas DOM-PP's deduces that the width is involved directly from the condition
supplied by the user.

Let's take this one level further, and consider this other simple condition:

> "All items of list `#mylist` must be left-aligned."

With DOM-PP:

```javascript
var dom = ... // Load page
var cond = TestCondition.create("All items are left-aligned",
  ForAllPairs("$x", "$y", "#mylist>li", Equals(Left("$x"), Left("$y")));
expectVerdict(cond.evaluate(dom)).showWitnesses();
```

Suppose you have a list of three items, and that item 3 is not aligned with
items 1 and 2; you get:

```
Left of #mylist/li[1], Left of #mylist/li[3]
Left of #mylist/li[2], Left of #mylist/li[3]
```

This time, each cause of the error involves *two* elements at a time, since an
element is misaligned with respect to another element.

With plain Mocha/JSDOM, things start to get ugly:

```javascript
var dom = ... // Load page
var elements = dom.querySelectorAll("#mylist>li");
var errors = [];
for (let i = 0; i < elements.length; i++) {
  var win = this.getOwnerWindow(elements[i]);
  for (let j = 0; j < elements.length; j++) {
    if (win.getComputedStyle(elements[i]).getPropertyValue("left")) 
      != (win.getComputedStyle(elements[j]).getPropertyValue("left")) {
    errors.push([elements[i], elements[j]]);
    }
  }
}
for (let i = 0; i < errors.length; i++) {
  console.log("Left of " + errors[i][0] + ", Left of " + errors[i][1]);
}
expect(errors.length).to.equal(0);
```

This is why we say that DOM-PP allows the user to write *simpler* conditions,
while getting more detailed feedback about violations *for free*.

Quick tutorial
--------------

### Functions

The main type object in dom-pp is called a `Function`. As its name implies, a
function is an object that can be *evaluated*: input arguments are passed to
it, and return values are produced. However, function calls in dom-pp follow
a slightly unusual syntax:

```java
var f = new IsGreaterThan();
var v = f.evaluate(2, 1);
```

In this example, method `evaluate` of object `q` is called on two input
arguments (the constants 2 and 1). Since function f is an assertion that can be
either true or false, one would expect that `v` be a Boolean value. However,
the value returned by the call is an instance of a special dom-pp class called
`Value`. A value contains, among other things, the actual "value" of the return
function; it can be obtained by calling its method `get`:

```java
var b = f.get(); // b == true
```

What is the point of encapsulating this verdict inside another object? Well,
the return value of the function is not the only thing that `v` contains; it
also stores information about the call to the function that can *explain* its
result. More on that later.

### Quantifiers

Since conditions are expressed on elements of a page, the first step is to
select a set of such elements so that one can write assertions about them.
This is done using either a *universal* or an *existential* quantifier.

The universal quantifier is called `ForAll`; it is instantiated by passing
three parameters to it:

1. The first is a string containing the name of a variable called the
   *quantified variable*. By convention, quantified variables start
   with a dollar sign ($) --for example, `$x`.
2. The second is a function called the *domain function*. It is the function
   used to extract from an input argument a list of objects. Typically in
   the context of DOM testing, that function is a CSS selector, and the
   objects are the various elements of the page corresponding to that selector.
3. The third is another function called the *condition*. This function contains
   references to the quantified variable (e.g. `$x`), and is successively
   evaluated by replacing it by each object produced by the domain function.

For example, to assert that all elements in the CSS class `foo` have a width
greater than 10, one would write:

```java
var q = new UniversalQuantifier(
  "$x",
  new FindBySelector("foo"),
  new ComposedFunction(new IsGreaterThan(), "$x", 10)
);
```

We recognize in this call the three elements of the quantifier: `$x` is the
quantified variable, the `FindBySelector` instance is the domain function,
and the remaining argument is a function that checks that `$x` is greater
than the constant 10.

Since a quantifier is also a function, it can be evaluated:

```java
var body = document.getElementById("body");
var v = q.evaluate(body);
var b = v.get(); // either true or false
```

The universal quantifier expects the condition to be true for all values of
`$x`. In constrast, the `ExistentialQuantifier` quantifier is created in the
same way, but expects the condition to be true for *at least* one value of
`$x`.

Quantifiers are similar to a construct that can be found in other testing
frameworks, and spares the user from writing `for` loops to repeatedly evaluate
a condition on a list of objects:

```java
var elems = document.getElementsByClassName("foo");
for (var i = 0; i < elems.length; i++) {
  assert(elems[i].width > 10);
}
```

Using quantifiers also has another utility over straight loops, which will be
discussed later.

### Composing functions

In dom-pp, a function is an object taking input arguments and producing a
`Value`. However, many conditions we need to express require the composition of
simpler functions. The task of combining multiple functions together, and
passing the output of one to the input of another, is done by another object
called `ComposedFunction`.

Suppose you want to express the fact that 

We have seen an example of a composed function in the code example above.
The instantiation of the `ComposedFunction` inside the quantifier is the dom-pp
equivalent of writing something like the following, in classical programming:

```java
function g(x) {
  return x > 10;
}
```

In effect, the constructor produces a new function taking one argument, and
comparing this argument to the value 10 using the `IsGreaterThan` function.

Composed functions can be nested; for example, it is possible to write that
x+1 is greater than 10:

```java
new ComposedFunction(new IsGreaterThan(),
  new ComposedFunction(new Addition(), "$x", 1),
  10);
```

The syntax for creating composed functions is as follows:

- the first argument of the constructor is the top level function to be
  evaluated;
- the remaining elements are the arguments passed to this function.

For example, in the code above, the function `IsGreaterThan` is passed two
arguments: the first another `ComposedFunction`, while the second is the
constant 10. Note that the number of arguments must match the input *arity*
of the function: `IsGreaterThan` takes two arguments, so two functions must
follow it in the constructor.

### All together now

Composed functions and quantifiers form the core of dom-pp. In order to write
complex assertions on elements of a page, one can mix these constructs with
the existing functions provided by the library:

- `GreaterThan`, `GreaterOrEqual`, `LessThan`, `LesserOrEqual` allow
  comparisons between numerical values;
- conditions can be composed with Boolean connectives: `BooleanAnd`,
  `BooleanOr`, `BooleanNot`;
- most CSS properties have functions of the same name, such as: `Color`,
  `BorderColor`, `Display`, `FontSize`, `MarginBottom`, `PaddingLeft`, etc.;
- basic arithmetic operations are also provided, like `Addition` and
  `Multiplication`.

For example, in order to state that all "foo" elements have the same width:

```java
var q = new UniversalQuantifier("$x", new FindBySelector("foo"),
  new UniversalQuantifier("$y", new FindBySelector("foo"),
    new ComposedFunction(new Equals(), "$x", "$y")));
```

The complete list of available function can be found in the auto-generated API
documentation: https://liflab.github.io/dom-pp/jsdoc/

Installing and building DOM-PP
------------------------------

## Git Clone

```bash
git clone https://github.com/liflab/dom-pp.git
```

## Install

```bash
npm install
```

## Testing

```bash
npm test
```

## Coverage

```bash
npm run coverage
```

## Code style

```bash
npm run lint
```

Will write a style report in `eslint.html` (not versioned).

## API Documentation

The following command will generate or update the API documentatation and store
it into a folder called `doc/jsdoc`.

```bash
npm run doc
```

## Compiling UMD builds for release

To generatte a browser friendly release build of the package, you can use the 
following commands:

**Development build:**
```js
npm run build:umd
```

**Production build (minified):**
```js
npm run build:umd.min
```

These will generate releaseable scripts in the `dist/` directory.  
It is important to note that the `dist/index.umd.js` is required to run the 
Puppeteer based tests. If the file does not exist when you attempt to run 
these tests, a verbose error message should be displayed, along with 
explanations on how to fix the issue.

Both of these commands should be ran before a new release of the package is
published, to ensure that the UMD builds correspond to the same version as
the ESM version of the package.



About the author
----------------

This library was written by [Sylvain Hallé](http://leduotang.ca/sylvain),
full professor at Université du Québec à Chicoutimi, Canada. Part of
this work has been funded by the Canada Research Chair in Software
Specification, Testing and Verification and the
[Natural Sciences and Engineering Research Council
of Canada](http://nserc-crsng.gc.ca), and by a MITACS Acceleration
Grant, in collaboration with [Eckinox Média](https://eckinox.ca).

The author would like to acknowledge the participation of
[Amadou Ba](https://github.com/amadouba9),
[Papa Alioune Fall](https://github.com/ppalioune) and
[Émile Perron](https://github.com/EmilePerron) to the development of this
library.
