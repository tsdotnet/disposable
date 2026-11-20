/*!
 * @author electricessence / https://github.com/electricessence/
 * @license MIT
 */

/**
 * Defines the contract for objects that can be disposed to release resources.
 * 
 * This interface allows for simple type checking that includes types that don't
 * explicitly declare themselves as implementing this interface but do have a
 * dispose() method. This enables structural typing for disposal operations.
 * 
 * @interface
 * 
 * @example
 * ```typescript
 * class DatabaseConnection implements Disposable {
 *   dispose(): void {
 *     // Close connection and release resources
 *   }
 * }
 * 
 * // Can also work with objects that have dispose method without explicit implementation
 * const someObject = {
 *   dispose() {
 *     console.log('Cleaning up...');
 *   }
 * };
 * // someObject is structurally compatible with Disposable
 * ```
 */
export default interface Disposable
{
	/**
	 * Releases all resources used by the object.
	 * 
	 * This method should be idempotent - calling it multiple times should have no
	 * additional effect after the first call. Implementations should:
	 * - Release any managed resources
	 * - Close connections, streams, or handles
	 * - Unsubscribe from events
	 * - Clear any references that could prevent garbage collection
	 * 
	 * @returns void
	 * 
	 * @example
	 * ```typescript
	 * const resource = new SomeDisposableResource();
	 * try {
	 *   // Use the resource...
	 * } finally {
	 *   resource.dispose(); // Always dispose when done
	 * }
	 * ```
	 */
	dispose(): void;
}
