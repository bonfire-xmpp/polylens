const Lens = require('./lens.js');

const test = {
    supportsExtendedSearch: false,
    array: [
	"list of things",
	1234,
	{
	    deeper: {
		supported: false,
	    },
	    supported: true,
	}
    ]
};

const supported = new Lens('supported', Lens.Object.deepest)
      .array(Lens.Array.deepest)
      .value(Lens.Value.type("boolean"));

console.log('Should be true: ', supported(test));
