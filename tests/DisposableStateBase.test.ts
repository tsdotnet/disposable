import { describe, it, expect, vi } from 'vitest'
import DisposableStateBase from '../src/DisposableStateBase.js'
import { DisposeState } from '../src/DisposeState.js'
import ObjectDisposedException from '../src/ObjectDisposedException.js'

class TestDisposableStateBase extends DisposableStateBase {
	public constructor(finalizer?: () => void) {
		super(finalizer)
	}

	public getDisposalState(): DisposeState {
		return (this as any).__disposeState.state
	}

	public setStateForTesting(state: DisposeState): void {
		(this as any).__disposeState.state = state
	}

	public callStartDispose(): boolean {
		return this._startDispose()
	}

	public callFinishDispose(): void {
		this._finishDispose()
	}

	public callOnBeforeDispose(): void {
		this._onBeforeDispose()
	}

	public callAssertIsAlive(strict?: boolean): boolean {
		return this.assertIsAlive(strict)
	}

	// Mock implementation for abstract class
	dispose(): void {
		if (!this._startDispose()) return
		try {
			// Mock disposal logic
		} finally {
			this._finishDispose()
		}
	}
}

describe('DisposableStateBase', () => {
	describe('constructor', () => {
		it('should initialize with Alive state', () => {
			const disposable = new TestDisposableStateBase()
			expect(disposable.getDisposalState()).toBe(DisposeState.Alive)
			expect(disposable.wasDisposed).toBe(false)
		})

		it('should store finalizer when provided', () => {
			const finalizer = vi.fn()
			const disposable = new TestDisposableStateBase(finalizer)
			expect(disposable.getDisposalState()).toBe(DisposeState.Alive)
			
			// Trigger disposal to test finalizer
			disposable.dispose()
			expect(finalizer).toHaveBeenCalledOnce()
		})

		it('should work without finalizer', () => {
			const disposable = new TestDisposableStateBase()
			expect(() => disposable.dispose()).not.toThrow()
		})
	})

	describe('wasDisposed property', () => {
		it('should return false when alive', () => {
			const disposable = new TestDisposableStateBase()
			expect(disposable.wasDisposed).toBe(false)
		})

		it('should return false when dispose called but not disposing', () => {
			const disposable = new TestDisposableStateBase()
			// Manually set to DISPOSE_CALLED state (before _startDispose transitions to DISPOSING)
			disposable.setStateForTesting(DisposeState.DisposeCalled)
			expect(disposable.wasDisposed).toBe(false)
		})

		it('should return true when disposing', () => {
			const disposable = new TestDisposableStateBase()
			disposable.callStartDispose() // This transitions to Disposing state
			expect(disposable.wasDisposed).toBe(true)
		})

		it('should return true when disposed', () => {
			const disposable = new TestDisposableStateBase()
			disposable.dispose()
			expect(disposable.wasDisposed).toBe(true)
		})
	})

	describe('assertIsAlive', () => {
		it('should return true when object is alive', () => {
			const disposable = new TestDisposableStateBase()
			expect(disposable.callAssertIsAlive()).toBe(true)
			expect(disposable.callAssertIsAlive(true)).toBe(true)
		})

		it('should throw when disposed (non-strict)', () => {
			const disposable = new TestDisposableStateBase()
			disposable.dispose()
			try {
				disposable.callAssertIsAlive()
				expect.fail('Should have thrown ObjectDisposedException')
			} catch (error) {
				expect(error).toBeInstanceOf(ObjectDisposedException)
				expect((error as ObjectDisposedException).objectName).toBe('TestDisposableStateBase')
			}
		})

		it('should throw when disposed (strict)', () => {
			const disposable = new TestDisposableStateBase()
			disposable.dispose()
			try {
				disposable.callAssertIsAlive(true)
				expect.fail('Should have thrown ObjectDisposedException')
			} catch (error) {
				expect(error).toBeInstanceOf(ObjectDisposedException)
				expect((error as ObjectDisposedException).objectName).toBe('TestDisposableStateBase')
			}
		})

		it('should not throw for DisposeCalled state (non-strict)', () => {
			const disposable = new TestDisposableStateBase()
			// Manually set to DisposeCalled state
			;(disposable as any).__disposeState.state = DisposeState.DisposeCalled
			expect(() => disposable.callAssertIsAlive(false)).not.toThrow()
		})

		it('should throw for DisposeCalled state (strict)', () => {
			const disposable = new TestDisposableStateBase()
			;(disposable as any).__disposeState.state = DisposeState.DisposeCalled
			try {
				disposable.callAssertIsAlive(true)
				expect.fail('Should have thrown ObjectDisposedException')
			} catch (error) {
				expect(error).toBeInstanceOf(ObjectDisposedException)
				expect((error as ObjectDisposedException).objectName).toBe('TestDisposableStateBase')
			}
		})
	})

	describe('_onBeforeDispose', () => {
		it('should be called during disposal', () => {
			class TestWithBeforeDispose extends TestDisposableStateBase {
				public beforeDisposeCalled = false
				
				protected _onBeforeDispose(): void {
					this.beforeDisposeCalled = true
				}
			}

			const disposable = new TestWithBeforeDispose()
			disposable.dispose()
			expect(disposable.beforeDisposeCalled).toBe(true)
		})

		it('should be overrideable', () => {
			const mockFn = vi.fn()
			class TestWithBeforeDispose extends TestDisposableStateBase {
				protected _onBeforeDispose(): void {
					mockFn()
				}
			}

			const disposable = new TestWithBeforeDispose()
			disposable.dispose()
			expect(mockFn).toHaveBeenCalledOnce()
		})
	})

	describe('_startDispose', () => {
		it('should return true on first call', () => {
			const disposable = new TestDisposableStateBase()
			expect(disposable.callStartDispose()).toBe(true)
		})

		it('should return false on subsequent calls', () => {
			const disposable = new TestDisposableStateBase()
			expect(disposable.callStartDispose()).toBe(true)
			expect(disposable.callStartDispose()).toBe(false)
			expect(disposable.callStartDispose()).toBe(false)
		})

		it('should transition states correctly', () => {
			const disposable = new TestDisposableStateBase()
			expect(disposable.getDisposalState()).toBe(DisposeState.Alive)
			
			disposable.callStartDispose()
			expect(disposable.getDisposalState()).toBe(DisposeState.Disposing)
		})

		it('should call _onBeforeDispose', () => {
			const mockFn = vi.fn()
			class TestWithBeforeDispose extends TestDisposableStateBase {
				protected _onBeforeDispose(): void {
					mockFn()
				}
			}

			const disposable = new TestWithBeforeDispose()
			disposable.callStartDispose()
			expect(mockFn).toHaveBeenCalledOnce()
		})

		it('should handle exceptions in _onBeforeDispose', () => {
			class TestWithThrowingBeforeDispose extends TestDisposableStateBase {
				protected _onBeforeDispose(): void {
					throw new Error('Test error')
				}
			}

			const disposable = new TestWithThrowingBeforeDispose()
			expect(() => disposable.callStartDispose()).toThrow('Test error')
			// State should still transition to Disposing
			expect(disposable.getDisposalState()).toBe(DisposeState.Disposing)
		})
	})

	describe('_finishDispose', () => {
		it('should set state to Disposed', () => {
			const disposable = new TestDisposableStateBase()
			disposable.callStartDispose()
			disposable.callFinishDispose()
			expect(disposable.getDisposalState()).toBe(DisposeState.Disposed)
		})

		it('should call finalizer if provided', () => {
			const finalizer = vi.fn()
			const disposable = new TestDisposableStateBase(finalizer)
			disposable.callStartDispose()
			disposable.callFinishDispose()
			expect(finalizer).toHaveBeenCalledOnce()
		})

		it('should freeze the disposal state', () => {
			const disposable = new TestDisposableStateBase()
			disposable.callStartDispose()
			disposable.callFinishDispose()
			
			const state = (disposable as any).__disposeState
			expect(Object.isFrozen(state)).toBe(true)
		})

		it('should remove finalizer after calling it', () => {
			const finalizer = vi.fn()
			const disposable = new TestDisposableStateBase(finalizer)
			disposable.callStartDispose()
			disposable.callFinishDispose()
			
			const state = (disposable as any).__disposeState
			expect(state.finalizer).toBeUndefined()
		})
	})

	describe('complete disposal lifecycle', () => {
		it('should follow proper state transitions', () => {
			const finalizer = vi.fn()
			const disposable = new TestDisposableStateBase(finalizer)
			
			// Initial state
			expect(disposable.getDisposalState()).toBe(DisposeState.Alive)
			expect(disposable.wasDisposed).toBe(false)
			
			// Full disposal
			disposable.dispose()
			
			// Final state
			expect(disposable.getDisposalState()).toBe(DisposeState.Disposed)
			expect(disposable.wasDisposed).toBe(true)
			expect(finalizer).toHaveBeenCalledOnce()
		})

		it('should be idempotent', () => {
			const finalizer = vi.fn()
			const disposable = new TestDisposableStateBase(finalizer)
			
			disposable.dispose()
			disposable.dispose()
			disposable.dispose()
			
			expect(finalizer).toHaveBeenCalledOnce()
		})
	})
})
