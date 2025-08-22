import { describe, it, expect, vi } from 'vitest'
import dispose, { using, type DisposableItem } from '../src/dispose.js'

class MockDisposable {
	public isDisposed = false
	dispose(): void {
		this.isDisposed = true
	}
}

class FaultyDisposable {
	dispose(): void {
		throw new Error('Disposal failed')
	}
}

describe('dispose', () => {
	describe('main dispose function', () => {
		it('should dispose single object', () => {
			const obj = new MockDisposable()
			dispose(obj)
			expect(obj.isDisposed).toBe(true)
		})

		it('should dispose multiple objects', () => {
			const obj1 = new MockDisposable()
			const obj2 = new MockDisposable()
			dispose(obj1, obj2)
			expect(obj1.isDisposed).toBe(true)
			expect(obj2.isDisposed).toBe(true)
		})

		it('should handle null and undefined', () => {
			const obj = new MockDisposable()
			expect(() => dispose(obj, null, undefined)).not.toThrow()
			expect(obj.isDisposed).toBe(true)
		})

		it('should ignore non-disposable objects', () => {
			const obj = { notDispose: true }
			expect(() => dispose(obj as any)).not.toThrow()
		})

		it('should throw on disposal errors', () => {
			const faulty = new FaultyDisposable()
			expect(() => dispose(faulty)).toThrow('Disposal failed')
		})
	})

	describe('dispose.single', () => {
		it('should dispose single object without exception handling', () => {
			const obj = new MockDisposable()
			dispose.single(obj)
			expect(obj.isDisposed).toBe(true)
		})

		it('should dispose single object with exception handling', () => {
			const faulty = new FaultyDisposable()
			const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
			
			expect(() => dispose.single(faulty, true)).not.toThrow()
			expect(consoleSpy).toHaveBeenCalledWith('Error during disposal:', expect.any(Error))
			
			consoleSpy.mockRestore()
		})

		it('should handle null input', () => {
			expect(() => dispose.single(null)).not.toThrow()
			expect(() => dispose.single(undefined)).not.toThrow()
		})
	})

	describe('dispose.withoutException', () => {
		it('should dispose objects and catch exceptions', () => {
			const obj1 = new MockDisposable()
			const faulty = new FaultyDisposable()
			const obj2 = new MockDisposable()

			expect(() => dispose.withoutException(obj1, faulty, obj2)).not.toThrow()
			expect(obj1.isDisposed).toBe(true)
			expect(obj2.isDisposed).toBe(true)
		})
	})

	describe('dispose.these', () => {
		it('should dispose array of objects', () => {
			const objects = [new MockDisposable(), new MockDisposable()]
			dispose.these(objects)
			expect(objects[0].isDisposed).toBe(true)
			expect(objects[1].isDisposed).toBe(true)
		})

		it('should handle empty array', () => {
			expect(() => dispose.these([])).not.toThrow()
		})

		it('should handle null array', () => {
			expect(() => dispose.these(null)).not.toThrow()
		})

		it('should trap exceptions when specified', () => {
			const obj1 = new MockDisposable()
			const faulty = new FaultyDisposable()
			const objects = [obj1, faulty]
			expect(() => dispose.these(objects, true)).not.toThrow()
			expect(obj1.isDisposed).toBe(true)
		})
	})

	describe('dispose.these.unsafe', () => {
		it('should dispose array without copying', () => {
			const objects = [new MockDisposable(), new MockDisposable()]
			dispose.these.unsafe(objects)
			expect(objects[0].isDisposed).toBe(true)
			expect(objects[1].isDisposed).toBe(true)
		})
	})

	describe('dispose.deferred', () => {
		it('should schedule disposal for next tick', async () => {
			const obj = new MockDisposable()
			dispose.deferred(obj)
			
			// Object should not be disposed immediately
			expect(obj.isDisposed).toBe(false)
			
			// Wait for next tick
			await new Promise(resolve => setTimeout(resolve, 0))
			expect(obj.isDisposed).toBe(true)
		})
	})

	describe('dispose.these.deferred', () => {
		it('should schedule array disposal', async () => {
			const objects = [new MockDisposable(), new MockDisposable()]
			dispose.these.deferred(objects)
			
			expect(objects[0].isDisposed).toBe(false)
			await new Promise(resolve => setTimeout(resolve, 0))
			expect(objects[0].isDisposed).toBe(true)
		})

		it('should schedule disposal with delay', async () => {
			const obj = new MockDisposable()
			dispose.these.deferred([obj], 10)
			
			expect(obj.isDisposed).toBe(false)
			await new Promise(resolve => setTimeout(resolve, 15))
			expect(obj.isDisposed).toBe(true)
		})
	})

	describe('dispose.these.deferred.unsafe', () => {
		it('should schedule disposal without copying array', async () => {
			const objects = [new MockDisposable()]
			dispose.these.deferred.unsafe(objects, 5)
			
			await new Promise(resolve => setTimeout(resolve, 10))
			expect(objects[0].isDisposed).toBe(true)
		})
	})
})

describe('using', () => {
	it('should dispose object after closure execution', () => {
		const obj = new MockDisposable()
		const result = using(obj, (disposable) => {
			expect(disposable.isDisposed).toBe(false)
			return 'success'
		})
		
		expect(result).toBe('success')
		expect(obj.isDisposed).toBe(true)
	})

	it('should dispose object even if closure throws', () => {
		const obj = new MockDisposable()
		
		expect(() => {
			using(obj, () => {
				throw new Error('Closure failed')
			})
		}).toThrow('Closure failed')
		
		expect(obj.isDisposed).toBe(true)
	})

	it('should return closure result', () => {
		const obj = new MockDisposable()
		const data = { value: 42 }
		
		const result = using(obj, () => data)
		expect(result).toBe(data)
	})
})
