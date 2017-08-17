export {
	isGeneratorFunction,
	isIterable,
	isPromise
}

// -----

const GeneratorFunctionCtor = Object.getPrototypeOf( function * () {} ).constructor
function isGeneratorFunction( fn ) {
	return fn instanceof GeneratorFunctionCtor
}

function isIterable( target ) {
	return target && typeof target[ Symbol.iterator ] === 'function'
}

function isPromise( p ) {
	return p instanceof Promise
}
