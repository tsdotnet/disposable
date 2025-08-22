/*!
 * @author electricessence / https://github.com/electricessence/
 * @license MIT
 */

import type DisposableAware from './DisposableAware';
import ObjectDisposedException from './ObjectDisposedException';
import { DisposeState } from './DisposeState';

const ALIVE = DisposeState.Alive;
const DISPOSE_CALLED = DisposeState.DisposeCalled;
const DISPOSING = DisposeState.Disposing;
const DISPOSED = DisposeState.Disposed;

/**
 * Abstract base class for disposable objects with state tracking.
 * 
 * Provides a robust foundation for implementing the disposable pattern with:
 * - State tracking through disposal lifecycle
 * - Thread-safe disposal operations
 * - Proper error handling during disposal
 * - Optional finalizer support
 * 
 * @abstract
 * @example
 * ```typescript
 * class MyDisposable extends DisposableStateBase {
 *   constructor() {
 *     super(() => console.log('Finalizing'));
 *   }
 * 
 *   protected _onBeforeDispose(): void {
 *     // Clean up before disposal
 *   }
 * }
 * ```
 */
export default abstract class DisposableStateBase
implements DisposableAware {

	/**
	 * Internal disposal state object that tracks the current state and optional finalizer.
	 * Using an object allows for sub classes to 'freeze' themselves without causing errors when disposing.
	 * @private
	 * @readonly
	 */
	private readonly __disposeState: { state: DisposeState, finalizer?: () => void };

	/**
	 * Creates a new DisposableStateBase instance.
	 * 
	 * @param finalizer - Optional callback function to execute after disposal is complete.
	 *                   This is useful for cleanup operations that need to occur after the object is fully disposed.
	 * @protected
	 */
	protected constructor(
		finalizer?: () => void | null) {
		this.__disposeState = {
			state: DisposeState.Alive,
			...(finalizer && { finalizer })
		};
	}

	/**
	 * Gets a value indicating whether this object has been disposed or is in the process of being disposed.
	 * 
	 * Returns `true` if the object is in the `Disposing` or `Disposed` state.
	 * Returns `false` if the object is `Alive` or disposal has been called but not yet started.
	 * 
	 * @returns True if the object has been disposed; otherwise, false.
	 */
	get wasDisposed(): boolean {
		const state = this.__disposeState.state;
		return state != ALIVE && state != DISPOSE_CALLED;
	}

	/**
	 * Validates that the object is still alive (not disposed or disposing).
	 * 
	 * @param strict - When true, throws an exception if the object is in any state other than `Alive`.
	 *                When false (default), only throws if the object is disposed or disposing.
	 * @returns Always returns true if the assertion passes.
	 * @throws {ObjectDisposedException} Thrown when the object is disposed or disposing (or not alive when strict is true).
	 * @protected
	 * 
	 * @example
	 * ```typescript
	 * public someMethod(): void {
	 *   this.assertIsAlive(); // Throws if disposed
	 *   // Proceed with method logic...
	 * }
	 * ```
	 */
	protected assertIsAlive(strict: boolean = false): boolean {
		const state = this.__disposeState.state;
		if (strict ? state !== ALIVE : this.wasDisposed) {
			throw new ObjectDisposedException(this.constructor.name);
		}
		return true;
	}

	/**
	 * This is important because some classes might react to disposal
	 * and still need access to the live class before it's disposed.
	 * In addition, no events should exist during or after disposal.
	 */
	
	/**
	 * Called before disposal commences. Override in derived classes to perform cleanup operations.
	 * 
	 * This method is called during the disposal process, after the state has been set to `DisposeCalled`
	 * but before the state transitions to `Disposing`. This allows derived classes to perform
	 * any necessary cleanup while the object is still accessible.
	 * 
	 * @protected
	 * @virtual
	 * 
	 * @example
	 * ```typescript
	 * protected _onBeforeDispose(): void {
	 *   // Unsubscribe from events
	 *   this.eventEmitter.removeAllListeners();
	 *   
	 *   // Close connections
	 *   this.connection?.close();
	 * }
	 * ```
	 */
	protected _onBeforeDispose(): void { }

	/**
	 * Initiates the disposal process.
	 * 
	 * This method ensures that disposal only happens once and is thread-safe.
	 * It transitions the object through the disposal states and calls the
	 * `_onBeforeDispose` method for cleanup operations.
	 * 
	 * @returns True if disposal was initiated successfully; false if the object was already disposed or disposal was already in progress.
	 * @protected
	 * 
	 * @remarks
	 * The disposal process follows these steps:
	 * 1. Check if object is alive - return false if not
	 * 2. Set state to `DisposeCalled`
	 * 3. Call `_onBeforeDispose()` for cleanup
	 * 4. Set state to `Disposing`
	 * 5. Return true to indicate successful initiation
	 */
	protected _startDispose(): boolean {
		// This check will guarantee that disposal only happens once, and only one thread is responsible for disposal.
		if (this.__disposeState.state !== ALIVE) {
			return false;
		}

		// Set to DISPOSE_CALLED
		this.__disposeState.state = DISPOSE_CALLED;

		try {
			this._onBeforeDispose();
		} finally {
			// Need to assure that 'disposing' was set even though there was an error in the try.
			// If by chance something internally called 'disposed()' then don't regress backwards.
			if (this.__disposeState.state === DISPOSE_CALLED) {
				this.__disposeState.state = DISPOSING;
			}
		}

		return true;
	}

	/**
	 * Completes the disposal process and executes the finalizer if one was provided.
	 * 
	 * This method should be called after all disposal operations are complete.
	 * It will:
	 * 1. Execute the finalizer callback if one was provided during construction
	 * 2. Set the disposal state to `Disposed`
	 * 3. Freeze the disposal state object to prevent further modifications
	 * 
	 * @protected
	 * 
	 * @remarks
	 * After this method is called, the object is considered fully disposed and
	 * the disposal state object is frozen to prevent any further state changes.
	 */
	protected _finishDispose(): void {
		const state = this.__disposeState;
		const finalizer = state.finalizer;
		delete state.finalizer;
		this.__disposeState.state = DISPOSED;
		Object.freeze(state);
		if (finalizer) finalizer();
	}
}