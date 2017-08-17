import co from '../src'

function delay( duration ) {
	return new Promise( function ( resolve ) {
		setTimeout( () => {
			resolve()
		}, duration || 0 )
	} )
}

describe( 'co', function () {
	it( '#basic', () => {
		const mock1 = jest.fn()
		const mock2 = jest.fn()

		const p =co( function * () {
			mock1()
			yield 1
			yield 2
			mock2()
		} )

		p.then( () => {
			expect( mock1 ).toHaveBeenCalledTimes( 1 )
			expect( mock2 ).toHaveBeenCalledTimes( 1 )
		} )
	} )

	it( '#promise', () => {
		const mock1 = jest.fn()
		const mock2 = jest.fn()

		const p = co( function * () {
			mock1()
			yield delay( 50 )
			yield delay( 100 )
			mock2()
		} )

		expect( mock1 ).toHaveBeenCalledTimes( 0 )
		expect( mock2 ).toHaveBeenCalledTimes( 0 )

		p.then( () => {
			expect( mock1 ).toHaveBeenCalledTimes( 1 )
			expect( mock2 ).toHaveBeenCalledTimes( 1 )
		} )
	} )
} )

describe( 'co.wrap', () => {
	it( '#basic', () => {
		const mock1 = jest.fn()
		const mock2 = jest.fn()

		const fn = co.wrap( function * () {
			mock1()
			yield delay( 50 )
			yield delay( 100 )
			mock2()
		} )

		expect( mock1 ).toHaveBeenCalledTimes( 0 )
		expect( mock2 ).toHaveBeenCalledTimes( 0 )

		fn().then( () => {
			expect( mock1 ).toHaveBeenCalledTimes( 1 )
			expect( mock2 ).toHaveBeenCalledTimes( 1 )
		} )
	} )

	it( '#combine co.wrap with co', () => {
		const mock1 = jest.fn()
		const mock2 = jest.fn()
		const mock3 = jest.fn()

		const fn = co.wrap( function * () {
			mock1()
			yield delay( 50 )
			yield delay( 100 )
			mock2()
		} )

		expect( mock1 ).toHaveBeenCalledTimes( 0 )
		expect( mock2 ).toHaveBeenCalledTimes( 0 )

		const p = co( function * () {
			yield fn()

			expect( mock1 ).toHaveBeenCalledTimes( 1 )
			expect( mock2 ).toHaveBeenCalledTimes( 1 )

			mock3()
		} )

		expect( mock3 ).toHaveBeenCalledTimes( 0 )

		p.then( () => {
			expect( mock3 ).toHaveBeenCalledTimes( 1 )
		} )
	} )
} )
