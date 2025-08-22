/*!
 * @author electricessence / https://github.com/electricessence/
 * @license MIT
 */

/**
 * Enumeration representing the various states of disposal for an object.
 * 
 * This enum provides a clear state machine for tracking the disposal lifecycle
 * of objects, ensuring proper sequencing and preventing invalid state transitions.
 * 
 * @enum {number}
 * 
 * @example
 * ```typescript
 * class MyDisposable {
 *   private state: DisposeState = DisposeState.Alive;
 *   
 *   dispose(): void {
 *     if (this.state !== DisposeState.Alive) return;
 *     
 *     this.state = DisposeState.DisposeCalled;
 *     try {
 *       this.state = DisposeState.Disposing;
 *       // Perform cleanup...
 *     } finally {
 *       this.state = DisposeState.Disposed;
 *     }
 *   }
 * }
 * ```
 */
export const enum DisposeState
{
  /**
   * The object is alive and fully functional.
   * This is the initial state for all disposable objects.
   * @memberof DisposeState
   */
  Alive = 0,
  
  /**
   * Disposal has been called but the disposal process has not yet started.
   * This is a transitional state that allows objects to prepare for disposal
   * and prevents multiple disposal attempts.
   * @memberof DisposeState
   */
  DisposeCalled = 1,
  
  /**
   * The object is currently in the process of being disposed.
   * During this state, cleanup operations are being performed and the
   * object should be considered unstable and unusable.
   * @memberof DisposeState
   */
  Disposing = 2,
  
  /**
   * The object has been completely disposed and all resources released.
   * This is the final state - objects cannot transition from this state
   * to any other state.
   * @memberof DisposeState
   */
  Disposed = 3
}

export type DisposeStateValue = typeof DisposeState[keyof typeof DisposeState];
