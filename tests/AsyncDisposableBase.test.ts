import { describe, it, expect, vi } from 'vitest'
import AsyncDisposableBase from '../src/AsyncDisposableBase.js'

class TestAsyncDisposableBase extends AsyncDisposableBase {
	public isDisposed = false

	protected constructor(finalizer?: () => void) {
		super(finalizer)
	}

	static create(finalizer?: () => void): TestAsyncDisposableBase {
		return new TestAsyncDisposableBase(finalizer)
	}

	protected async _onDisposeAsync(): Promise<void> {
		// Simulate async disposal
		await new Promise(resolve => setTimeout(resolve, 1))
		this.isDisposed = true
	}

	// Expose protected methods for testing
	public testStartDispose(): boolean {
		return this._startDispose()
	}

	public testFinishDispose(): void {
		this._finishDispose()
	}
}

class FaultyAsyncDisposable extends AsyncDisposableBase {
	protected constructor() {
		super()
	}

	static create(): FaultyAsyncDisposable {
		return new FaultyAsyncDisposable()
	}

	protected async _onDisposeAsync(): Promise<void> {
		throw new Error('Async disposal failed')
	}
}

describe('AsyncDisposableBase', () => {
	describe('disposeAsync', () => {
		it('should dispose object asynchronously', async () => {
			const disposable = TestAsyncDisposableBase.create()
			expect(disposable.wasDisposed).toBe(false)

			await disposable.disposeAsync()

			expect(disposable.wasDisposed).toBe(true)
			expect((disposable as any).isDisposed).toBe(true)
		})

		it('should be idempotent', async () => {
			const disposable = TestAsyncDisposableBase.create()
			
			await disposable.disposeAsync()
			await disposable.disposeAsync() // Should not throw or cause issues
			
			expect(disposable.wasDisposed).toBe(true)
		})

		it('should call finalizer after disposal', async () => {
			const finalizerSpy = vi.fn()
			const disposable = TestAsyncDisposableBase.create(finalizerSpy)
			
			await disposable.disposeAsync()
			
			expect(finalizerSpy).toHaveBeenCalledOnce()
		})

		it('should handle exceptions in _onDisposeAsync', async () => {
			const faulty = FaultyAsyncDisposable.create()
			
			await expect(faulty.disposeAsync()).rejects.toThrow('Async disposal failed')
			expect(faulty.wasDisposed).toBe(true) // Should still be marked as disposed
		})
	})

	describe('inheritance', () => {
		it('should extend DisposableStateBase', () => {
			const disposable = TestAsyncDisposableBase.create()
			expect(disposable.wasDisposed).toBe(false)
			
			// Should have methods from DisposableStateBase
			expect(typeof (disposable as any).assertIsAlive).toBe('function')
		})
	})
})
