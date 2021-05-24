module.exports = {
    /**
     * The identity function. Returns any value it finds
     */
    id(x) { return x; },

    /**
     * Returns the value iff they are type-check equal (===)
     */
    eq(x) { return function(y){if(x===y)return y;}; },

    /**
     * Returns the value iff its type matches the given one
     */
    type(t) { return function(y){if(typeof y===t)return y;}; },
}
