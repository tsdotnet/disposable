/*!
 * @author electricessence / https://github.com/electricessence/
 * @license MIT
 */

/**
 * Defines the contract for objects that can report their disposal state.
 * 
 * This interface does NOT extend `Disposable` because it represents objects that can
 * report whether they have been disposed, but may not necessarily be disposable themselves.
 * This separation allows for:
 * 
 * - Objects that are disposed by external managers
 * - State observers that need to check disposal status
 * - Utility functions that work with disposal state without requiring disposal capability
 * 
 * Use this interface when you need to check if something has been disposed but don't
 * need the ability to dispose it directly.
 * 
 * @interface
 * 
 * @example
 * ```typescript
 * // A class that can be disposed but implements DisposableAware for state checking
 * class StatefulResource implements DisposableAware {
 *   private _disposed = false;
 *   
 *   get wasDisposed(): boolean {
 *     return this._disposed;
 *   }
 *   
 *   dispose(): void {
 *     if (!this._disposed) {
 *       // Perform cleanup
 *       this._disposed = true;
 *     }
 *   }
 *   
 *   doWork(): void {
 *     if (this.wasDisposed) {
 *       throw new Error('Cannot work on disposed object');
 *     }
 *     // Perform work...
 *   }
 * }
 * 
 * // A utility function that only needs to check disposal state
 * function isResourceStillUsable(resource: DisposableAware): boolean {
 *   return !resource.wasDisposed;
 * }
 * ```
 */
export default interface DisposableAware
{
	/**
	 * Gets a value indicating whether the object has been disposed.
	 * 
	 * This property should return `true` once the object has been disposed
	 * and should remain `true` for the lifetime of the object. It should
	 * never transition back to `false` after being set to `true`.
	 * 
	 * @readonly
	 * @returns `true` if the object has been disposed; otherwise, `false`.
	 * 
	 * @example
	 * ```typescript
	 * function safeOperation(resource: DisposableAware): void {
	 *   if (resource.wasDisposed) {
	 *     console.warn('Resource already disposed, skipping operation');
	 *     return;
	 *   }
	 *   
	 *   // Safe to use resource
	 *   performOperation(resource);
	 * }
	 * ```
	 */
	readonly wasDisposed: boolean;
}
