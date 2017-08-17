import { isGeneratorFunction, isIterable, isPromise } from './utils/is'

export default co

// -----

function co( fn ) {
	if ( !isGeneratorFunction( fn ) ) {
		return Promise.resolve().then( fn )
	}

	const gen = fn()

	function onNext( extra ) {
		const enterance = extra ? gen.next( extra ) : gen.next()

		if ( enterance.done ) {
			return
		}

		return ensurePromise( enterance.value )
			.then( onNext, onError )
	}

	function onError( e ) {
		gen.throw( e )
	}

	return Promise.resolve().then( onNext )
}

co.wrap = function ( fn ) {
	return function () {
		return co( fn )
	}
}

function ensurePromise( target ) {
	if ( !isPromise( target ) ) {
		target = Promise.resolve( target )
	}

	return target
}
