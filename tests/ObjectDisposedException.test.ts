import { describe, it, expect } from 'vitest'
import ObjectDisposedException from '../src/ObjectDisposedException.js'
import type DisposableAware from '../src/DisposableAware.js'

// Mock disposable object for testing
class MockDisposableAware implements DisposableAware {
	private _disposed = false

	get wasDisposed(): boolean {
		return this._disposed
	}

	dispose(): void {
		this._disposed = true
	}

	setDisposed(disposed: boolean): void {
		this._disposed = disposed
	}
}

describe('ObjectDisposedException', () => {
	describe('constructor', () => {
		it('should create exception with object name', () => {
			const ex = new ObjectDisposedException('TestObject')
			expect(ex.objectName).toBe('TestObject')
			expect(ex.name).toBe('ObjectDisposedException')
		})

		it('should create exception with custom message', () => {
			const customMessage = 'Custom error message'
			const ex = new ObjectDisposedException('TestObject', customMessage)
			expect(ex.objectName).toBe('TestObject')
			expect(ex.message).toBe(customMessage)
		})

		it('should create exception with default message when no message provided', () => {
			const ex = new ObjectDisposedException('TestObject')
			expect(ex.message).toBe("Object 'TestObject' has been disposed and cannot be used.")
		})

		it('should be instance of Error', () => {
			const ex = new ObjectDisposedException('TestObject')
			expect(ex).toBeInstanceOf(Error)
			expect(ex).toBeInstanceOf(ObjectDisposedException)
		})
	})

	describe('throwIfDisposed', () => {
		it('should return true when object is not disposed', () => {
			const mock = new MockDisposableAware()
			const result = ObjectDisposedException.throwIfDisposed(mock, 'TestObject')
			expect(result).toBe(true)
		})

		it('should throw when object is disposed', () => {
			const mock = new MockDisposableAware()
			mock.setDisposed(true)
			
			expect(() => {
				ObjectDisposedException.throwIfDisposed(mock, 'TestObject')
			}).toThrow(ObjectDisposedException)
		})

		it('should throw with correct object name', () => {
			const mock = new MockDisposableAware()
			mock.setDisposed(true)
			
			expect(() => {
				ObjectDisposedException.throwIfDisposed(mock, 'MySpecialObject')
			}).toThrow(ObjectDisposedException)
			
			try {
				ObjectDisposedException.throwIfDisposed(mock, 'MySpecialObject')
			} catch (error) {
				expect(error).toBeInstanceOf(ObjectDisposedException)
				if (error instanceof ObjectDisposedException) {
					expect(error.objectName).toBe('MySpecialObject')
				}
			}
		})

		it('should throw with custom message when provided', () => {
			const mock = new MockDisposableAware()
			mock.setDisposed(true)
			const customMessage = 'Cannot perform this operation'
			
			expect(() => {
				ObjectDisposedException.throwIfDisposed(mock, 'TestObject', customMessage)
			}).toThrow(ObjectDisposedException)
			
			try {
				ObjectDisposedException.throwIfDisposed(mock, 'TestObject', customMessage)
			} catch (error) {
				expect(error).toBeInstanceOf(ObjectDisposedException)
				if (error instanceof ObjectDisposedException) {
					expect(error.message).toBe(customMessage)
				}
			}
		})

		it('should throw with default message when no message provided', () => {
			const mock = new MockDisposableAware()
			mock.setDisposed(true)
			
			expect(() => {
				ObjectDisposedException.throwIfDisposed(mock, 'TestObject')
			}).toThrow(ObjectDisposedException)
			
			try {
				ObjectDisposedException.throwIfDisposed(mock, 'TestObject')
			} catch (error) {
				expect(error).toBeInstanceOf(ObjectDisposedException)
				if (error instanceof ObjectDisposedException) {
					expect(error.message).toBe("Object 'TestObject' has been disposed and cannot be used.")
				}
			}
		})

		it('should work with different disposable implementations', () => {
			// Test with different object that has wasDisposed = false
			const notDisposed = { wasDisposed: false, dispose: () => {} }
			expect(() => ObjectDisposedException.throwIfDisposed(notDisposed, 'Test')).not.toThrow()

			// Test with different object that has wasDisposed = true
			const disposed = { wasDisposed: true, dispose: () => {} }
			expect(() => ObjectDisposedException.throwIfDisposed(disposed, 'Test')).toThrow()
		})
	})

	describe('error properties', () => {
		it('should have correct name property', () => {
			const ex = new ObjectDisposedException('TestObject')
			expect(ex.name).toBe('ObjectDisposedException')
		})

		it('should preserve stack trace', () => {
			const ex = new ObjectDisposedException('TestObject')
			expect(ex.stack).toBeDefined()
			expect(ex.stack).toContain('ObjectDisposedException')
		})

		it('should be catchable as Error', () => {
			const mock = new MockDisposableAware()
			mock.setDisposed(true)
			
			let caughtError: Error | null = null
			try {
				ObjectDisposedException.throwIfDisposed(mock, 'TestObject')
			} catch (error) {
				caughtError = error as Error
			}
			
			expect(caughtError).toBeInstanceOf(Error)
			expect(caughtError).toBeInstanceOf(ObjectDisposedException)
		})
	})
})
