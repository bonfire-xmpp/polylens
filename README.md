# polylens

A polytypic lens library for Javascript.

### What are lens?

Lens, coming from the Haskell `lens` library, are a set of functions that aim to
solve the issue of accessing deeply nested fields in objects. They 'scan' your
data type and generate appropriate functions (called lens) that can 'magnify'
into whatever fields you need.

There are implementations of `lens` in Javascript. If you find yourself oft writing
```js
object.client.jingle.transport.state.getErrorCount();
```
...or something similarly long, you're a prime candidate for lens!

### What is polytypic programming?

You are probably familiar with (ad-hoc) polymorphism: examples are Java and C#
interfaces, and in a certain sense OOP-style inheritance.

Borrowing from [Patrik Jansson's excellent PhD thesis on the
subject](https://www.cse.chalmers.se/~patrikj/poly/polythesis/): ad-hoc
polymorphic functions are functions such as `length`, which count the length of
a given container.

`length` has many definitions, depending on what container it acts on:

```c++
template<typename T>
size_t List::length()
{
	const auto* curr = this->head;
	size_t i;
	for(i = 0; curr != nullptr; i++) curr = *curr->next;
	return i;
}
```

```js
function length(tree) {
    if(tree.isNode) return 0;
	return 1 + length(tree.left) + length(tree.right);
}
```
Its definition is instantiated per each type it acts on (in this case a linked
list and binary tree).


Contrast that with parametric polymorphism which aims to acts on _all_ types
with a _single_ definition:
```hs
swap :: (a, b) -> (b, a)
swap (a, b) = (b, a)
```
However, since it has to act on _all_ types, it can only do with the values
whatever it can do on _any_ type -- and that, in strict type systems, is
generally nothing. This way we can ensure nothing stupid happens in our definitions:
```js
const swap = ([a,b]) => [b+1,a];
```


Polytypic programming is a mix between these two: it aims to write a single
function definition that can work across all containers. It does this by boiling
down every type into only a few patterns that the polytypic function has to
handle.

That way, with just one definition of `length`, we can get a function that works
on both lists _and_ trees, and even maps which might not have even been defined
at the time.

In Javascript, this means splitting our function into sub-functions that handle
the different JS types: Number, Boolean, String, Array, Object, and Function.
Custom types are, sadly, practically impossible to handle (at least not as
tightly as they are in the aforementioned Polyp).


### So, what are polytypic lenses?

As we've seen, a lens aims to magnify data deeply nested in some repeating
structure: it works across different values of the _same type_.

And polytypic functions work on different types of _containers_.

Together, we get a construct which works across any _container_, and aims to
extract any _data_ from it. It is the structural equivalent of a regular
expression (though it probably is a contextful grammar).


### Okay, but why would you need these?

It is a perfect fit for extracting common data out of a heterogeneous list.

Personally, I had this issue when storing XEP support data in a Redux-style
store: In one single place, I had to store all the necessary data about the
server support for each XEP. Usually, a simple `true`/`false` would be enough,
but in certain cases I needed to store finer granularity.

The options I had were to either store it in another place separately (and lower
the 'generality' of data I was storing), or store it heterogeneously together,
and write a special processing function for each non-trivial XEP which would
answer definitively -- or wrap everything in an object with a common field
(which would mean a lot of singletons).

With polytypic lens, I can write a single definition on how to check for
support on any value, and store everything in its own format, if I needed to.

Javascript's dynamic (duck) typing gives it its agile development, and polylens
aims to expand the acceptable use-case of ad-hoc object structures.

## Usage

The library exports the `Lens` class. Before proper use, you must set a function
for each data type that will handle values of that type. This is done by passing
that function (called a strategy) to the appropriate method, i.e.
```js
new Lens()
	.array(myArrayStrategy)    // can be chained
	.function(_ => undefined)  // and ordering isn't important
	.number(myNumberStrategy)
	// etc
```

There are a few helper methods for settings strategies:
 - `.values()` sets the same handler for all trivial values (numbers, strings and booleans)
 - `.objects()` sets the same handler for all values with `typeof` object (i.e. both objects and arrays)

There are also some predefined strategies for each type:
 - `Lens.Array.some` picks array-order first element that matches
 - `Lens.Array.deepest` maps lens over elements, then picks the result which was found deepest
 - `Lens.Array.shallowest` maps lens over elements, then picks the result which was found shallowest
 - `Lens.Object.field(name, strategy)` returns the match of the value of the field with name `name`, if it exists, otherwise applies, `strategy`
 - `Lens.Object.deepest` same as Array, but over properties
 - `Lens.Object.shallowest` same as Array, but over properties
 - `Lens.Values.id` returns the value as-is
 - `Lens.Values.eq(x)` returns the value iff it is equal (`===`) to `x`
 - `Lens.Values.type(t)` returns the value iff its `typeof` is equal to `t`

And two helper static functions:
 - `Lens.isTrivial(x)`
 - `Lens.isNontrivial(x)`

The library is still in active development. For a usage example, see `/test.js`.
