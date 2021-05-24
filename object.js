module.exports = {
    /**
     * Return value of field with `name`, otherwise recurses with `strategy`.
     */
    field(name, strategy) {
	return function(o){
	    const push = this.depth;
	    const r = this(o[name]);
	    if(r !== undefined) return r;
	    this.depth = push;

	    return strategy.call(this, o);
	};
    },

    /**
     * Maps lens over elements, then picks the result which was found deepest
     */
    deepest(xs) {
	const results = [];
	for(const x in xs) {

	    const push = this.depth;
	    const r = this(xs[x]);

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
	for(const x in xs) {

	    const push = this.depth;
	    const r = this(xs[x]);

	    if(r !== undefined)
		results.push({r, depth: this.depth});

	    this.depth = push
	}

	const best = results.sort((a, b) => a.depth - b.depth)[0];
	this.depth = best.depth;
	return best.r;
    },
}
