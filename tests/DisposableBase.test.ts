import { describe, it, expect } from 'vitest'
import { DisposableBase } from '../src/index.js'

class MyDisposable extends DisposableBase {
	constructor(finalizer?: () => void) {
		super('MyDisposable', finalizer)
	}

	test(): void {
		this.throwIfDisposed()
	}
}

describe('DisposableBase', () => {
	it('should have a proper life cycle', () => {
		let wasFinalized = false
		const d = new MyDisposable(() => (wasFinalized = true))

		expect(d.wasDisposed).toBe(false)
		expect(() => d.test()).not.toThrow()

		d.dispose()

		expect(d.wasDisposed).toBe(true)
		expect(() => d.test()).toThrow()
		expect(wasFinalized).toBe(true)
	})
})
