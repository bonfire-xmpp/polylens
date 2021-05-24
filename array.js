module.exports = {
    /**
     * Some array deconstruction strategy: picks array-order first element.
     */
    some(xs) {
	for(const x of xs) {
	    const push = this.depth;
	    const r = this(x);
	    this.depth = push

	    if(r !== undefined)
		return r;
	}
    },

    /**
     * Maps lens over elements, then picks the result which was found deepest
     */
    deepest(xs) {
	const results = [];
	for(const x of xs) {

	    const push = this.depth;
	    const r = this(x);

	    if(r !== undefined)
		results.push({r, depth: this.depth});

	    this.depth = push
	}

	const best = results.sort((a, b) => b.depth - a.depth)[0];
	this.depth = best.depth;
	return best.r;
    },

    /**
     * Maps lens over elements, then picks the result which was found shallowest
     */
    shallowest(xs) {
	const results = [];
	for(const x of xs) {

	    const push = this.depth;
	    const r = this(x);

	    if(r !== undefined)
		results.push({r, depth: this.depth});

	    this.depth = push
	}

	const best = results.sort((a, b) => a.depth - b.depth)[0];
	this.depth = best.depth;
	return best.r;
    },
};
