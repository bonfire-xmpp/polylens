const Arr = require('./array.js');
const Value = require('./value.js');
const Obj = require('./object.js');

/**
 * The Lens class.
 */
module.exports = class Lens extends Function {
    // Export predefined strategies and utilities, etc.
    static Array = Arr;
    static Value = Value;
    static Object =  Obj;

    static isTrivial(x){return['string','boolean','number'].includes(typeof x)};
    static isNontrivial(x){return !isTrivial(x);};

    /**
     * @param fieldName Optional parameter. Sets name in object strategy
     * `field(name, strategy)`, or the object strategy if it is a function.
     * @param strategy Optional parameter. Sets strategy in object strategy
     * `field(name, strategy)`, if `name` is a string
     */
    constructor(fieldName, strategy) {
	super()

	var closure = function(...args) { return closure._call(...args) }

	// Used to track recursion depth, for strategies that need it.
	//
	// Note: you will have to push/pop this variable manually in strategies
	// handling product types with non-trivial (depthful) components
	closure.depth = 0;

	// Generate initial Lens.xyz() functions to set corresponding strategies.
	// Non-complete definitions may not work across all types and are to be
	// considered malformed.
	const types = ["string","number","boolean","function","object","array"];
	for(const type of types) {
	    closure[type] = function(f) {
		// Ensure weird things don't happen, especially in case the Lens is
		// partial
		if(typeof f !== "function")
		    throw new TypeError(
			`Passed non-function as lens deconstructor for ${type}!`);

		// Replace this function with the passed function
		closure[type] = f;

		// Support for chaining Lens.string().boolean(), etc.
		return closure;
	    }
	}

	// Shorthand for setting all 'trivial' constant value types: string,
	// boolean and number.
	closure.value = function(f) {
	    if(typeof f !== "function")
		throw new TypeError(
		    `Passed non-function as lens deconstructor for ${type}!`);
	    closure.string = closure.number = closure.boolean = f;

	    // Support for chaining Lens.string().boolean(), etc.
	    return closure;
	}

	// Shorthand for setting types with typeof 'object'.
	closure.objects = function(f) {
	    if(typeof f !== "function")
		throw new TypeError(
		    `Passed non-function as lens deconstructor for ${type}!`);
	    closure.object = closure.array = f;

	    // Support for chaining Lens.string().boolean(), etc.
	    return closure;
	}

	if(typeof fieldName === "string") {
	    closure.object(Lens.Object.field(fieldName, strategy));
	} else if(typeof fieldName === "function") {
	    closure.object(fieldName);
	}

	// Make us callable
	return Object.setPrototypeOf(closure, new.target.prototype)
    };

    _call(f) {
	// Increases recursive depth counter
	this.depth++;

	// console.log(this.depth, f);

	// Dynamic dispatch ~ equivalent of replacing type constructors
	switch(typeof f) {
	case "string":
	    return this.string.call(this, f); break;
	case "number":
	    return this.number.call(this, f); break;
	case "boolean":
	    return this.boolean.call(this, f); break;
	case "function":
	    return this.function.call(this, f); break;
	case "object":
	    if(Array.isArray(f))
		return this.array.call(this, f);
	    return this.object.call(this, f);
	}
    }
}
