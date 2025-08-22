/*!
 * @author electricessence / https://github.com/electricessence/
 * @license MIT
 */

import type DisposableAware from './DisposableAware';
import ObjectDisposedException from './ObjectDisposedException';
import { DisposeState, type DisposeStateValue } from './DisposeState';

const ALIVE = DisposeState.Alive;
const DISPOSE_CALLED = DisposeState.DisposeCalled;
const DISPOSING = DisposeState.Disposing;
const DISPOSED = DisposeState.Disposed;

/**
 * Abstract base class for objects with disposal state tracking.
 */
export default abstract class DisposableStateBase
  implements DisposableAware {

  /**
   * Internal disposal state and optional finalizer.
   * @private
   */
  private readonly __disposeState: { state: DisposeState, finalizer?: () => void };

  /**
   * @param finalizer Optional callback executed after disposal completes.
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
   * Current disposal state.
   */
  protected get disposeState(): DisposeStateValue {
    return this.__disposeState.state;
  }

  /**
   * True if object is disposed or disposing.
   */
  get wasDisposed(): boolean {
    const state = this.__disposeState.state;
    return state != ALIVE && state != DISPOSE_CALLED;
  }

  /**
   * Throws ObjectDisposedException if object is disposed.
   * @param strict When true, throws if not in Alive state.
   * @protected
   */
  protected assertIsAlive(strict: boolean = false): boolean {
    const state = this.__disposeState.state;
    if (strict ? state !== ALIVE : this.wasDisposed) {
      throw new ObjectDisposedException(this.constructor.name);
    }
    return true;
  }

  /**
   * Called before disposal starts. Override in derived classes.
   * @protected
   */
  protected _onBeforeDispose(): void { }
  /**
   * Initiates disposal process. Returns false if already disposed.
   * @protected
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
   * Completes disposal process and executes finalizer.
   * @protected
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