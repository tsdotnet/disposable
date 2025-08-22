/*!
 * @author electricessence / https://github.com/electricessence/
 * @license MIT
 */

/**
 * Defines the contract for objects that can be disposed asynchronously to release resources.
 * 
 * This interface is for objects that require asynchronous operations during disposal,
 * such as closing database connections, flushing buffers, or performing network cleanup.
 * This allows for simple type checking that includes types that don't explicitly declare
 * themselves as implementing this interface but do have a disposeAsync() method.
 * 
 * @interface
 * 
 * @example
 * ```typescript
 * class AsyncDatabaseConnection implements AsyncDisposable {
 *   async disposeAsync(): Promise<void> {
 *     await this.flushPendingOperations();
 *     await this.closeConnection();
 *   }
 * }
 * 
 * // Usage with async/await
 * const connection = new AsyncDatabaseConnection();
 * try {
 *   // Use connection...
 * } finally {
 *   await connection.disposeAsync();
 * }
 * ```
 */
export default interface AsyncDisposable
{
	/**
	 * Asynchronously releases all resources used by the object.
	 * 
	 * This method should be idempotent - calling it multiple times should have no
	 * additional effect after the first call completes. Implementations should:
	 * - Await any pending asynchronous operations
	 * - Close connections, streams, or handles asynchronously
	 * - Flush any buffers or pending data
	 * - Unsubscribe from async events or observables
	 * - Clear any references that could prevent garbage collection
	 * 
	 * @returns A Promise that resolves when disposal is complete.
	 * 
	 * @example
	 * ```typescript
	 * class FileBuffer implements AsyncDisposable {
	 *   async disposeAsync(): Promise<void> {
	 *     await this.flush(); // Write pending data
	 *     await this.close(); // Close file handle
	 *   }
	 * }
	 * 
	 * // Proper async disposal
	 * const buffer = new FileBuffer();
	 * try {
	 *   // Use buffer...
	 * } finally {
	 *   await buffer.disposeAsync(); // Wait for complete cleanup
	 * }
	 * ```
	 */
	disposeAsync(): Promise<void>;
}
