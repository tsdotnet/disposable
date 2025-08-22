/*!
 * @author electricessence / https://github.com/electricessence/
 * @license MIT
 */

import type Disposable from './Disposable';

/**
 * Represents a disposable item that can be null or undefined for convenience.
 * This allows for flexible disposal operations without null checks.
 */
export type DisposableItem = Disposable | null | undefined;

/**
 * Represents an array of disposable items that can itself be null or undefined.
 * This allows for flexible batch disposal operations.
 */
export type DisposableItemArray = DisposableItem[] | null | undefined;

/* eslint-disable @typescript-eslint/no-namespace */

/**
 * Disposes multiple disposable objects, throwing any exceptions that occur during disposal.
 * 
 * This is the main disposal function that takes a variable number of disposable objects
 * and calls their dispose methods. Any exceptions thrown during disposal will propagate
 * to the caller.
 * 
 * @param disposables - The objects to dispose of. Can accept any type and will safely ignore 
 *                     objects that don't have a dispose() method or are null/undefined.
 * @throws {Error} Any exception thrown by the dispose() methods of the objects.
 * 
 * @example
 * ```typescript
 * const resource1 = new DatabaseConnection();
 * const resource2 = new FileStream();
 * 
 * // Dispose multiple resources at once
 * dispose(resource1, resource2, null); // null is safely ignored
 * ```
 * 
 * @see {@link dispose.withoutException} For exception-safe disposal
 * @see {@link dispose.these} For disposing arrays of disposables
 */
export function dispose (...disposables: DisposableItem[]): void
{
	// The disposables arguments array is effectively localized so it's safe.
	theseUnsafe(disposables, false);
}

/**
 * Namespace containing additional disposal utility functions.
 */
export namespace dispose
{
	/**
	 * Disposes a single object efficiently without creating arrays.
	 * 
	 * Use this method when disposing only one object to avoid the overhead
	 * of creating an arguments array.
	 * 
	 * @param disposable - The object to dispose.
	 * @param trapException - If true, catches and logs exceptions instead of throwing them.
	 * 
	 * @example
	 * ```typescript
	 * const resource = new MyResource();
	 * dispose.single(resource); // Throws on error
	 * dispose.single(resource, true); // Logs errors instead of throwing
	 * ```
	 */
	export function single (disposable: DisposableItem, trapException: boolean = false): void
	{
		if(disposable) singleUnsafe(disposable, trapException);
	}

	/**
	 * Disposes multiple objects asynchronously after a zero timeout.
	 * 
	 * This method schedules disposal to occur asynchronously, which can be useful
	 * for avoiding blocking the current execution thread. All exceptions are logged
	 * but not thrown to prevent unhandled promise rejections.
	 * 
	 * @param disposables - The objects to dispose of asynchronously.
	 * 
	 * @example
	 * ```typescript
	 * // Schedule disposal for next tick
	 * dispose.deferred(resource1, resource2, resource3);
	 * // Execution continues immediately, disposal happens asynchronously
	 * ```
	 */
	export function deferred (...disposables: DisposableItem[]): void
	{
		// The disposables arguments array is effectively localized so it's safe.
		these.deferred.unsafe(disposables);
	}

	/**
	 * Disposes multiple objects while catching and ignoring any exceptions.
	 * 
	 * This method is useful when you want to ensure all objects are disposed
	 * even if some of them throw exceptions during disposal. Exceptions are
	 * suppressed to prevent them from interrupting the disposal process.
	 * 
	 * @param disposables - The objects to dispose of. Exceptions during disposal are caught and ignored.
	 * 
	 * @example
	 * ```typescript
	 * // Dispose all objects, even if some throw exceptions
	 * dispose.withoutException(resource1, faultyResource, resource3);
	 * // All objects are disposed, even if faultyResource throws an exception
	 * ```
	 */
	export function withoutException (...disposables: DisposableItem[]): void
	{
		// The disposables arguments array is effectively localized so it's safe.
		theseUnsafe(disposables, true);
	}

	/**
	 * Disposes an array of disposable objects.
	 * 
	 * This method creates a copy of the input array before disposal to prevent
	 * modification during the disposal process, making it safe to use even if
	 * disposal methods modify the original array.
	 * 
	 * @param disposables - Array of objects to dispose. The array itself can be null or undefined.
	 * @param trapExceptions - If true, catches exceptions during disposal instead of throwing them.
	 * 
	 * @example
	 * ```typescript
	 * const resources = [connection1, stream2, timer3];
	 * dispose.these(resources); // Safe even if disposal modifies the original array
	 * dispose.these(resources, true); // Catch exceptions during disposal
	 * ```
	 */
	export function these (disposables: DisposableItemArray, trapExceptions?: boolean): void
	{
		if(!disposables || !disposables.length) return;
		theseUnsafe(disposables.slice(), trapExceptions);
	}

	/**
	 * Namespace for array disposal operations.
	 */
	export namespace these
	{
		/**
		 * Disposes an array of objects asynchronously after an optional delay.
		 * 
		 * This method creates a copy of the input array and schedules disposal
		 * to occur after the specified delay. This is useful for cleanup operations
		 * that should happen after the current execution context completes.
		 * 
		 * @param disposables - Array of objects to dispose asynchronously.
		 * @param delay - Milliseconds to wait before disposing. Default is 0.
		 *               Higher values may improve foreground performance but delay cleanup.
		 * 
		 * @example
		 * ```typescript
		 * // Dispose immediately on next tick
		 * dispose.these.deferred(resourceArray);
		 * 
		 * // Dispose after 100ms delay  
		 * dispose.these.deferred(resourceArray, 100);
		 * ```
		 */
		// tslint:disable-next-line:no-shadowed-variable
		export function deferred (disposables: DisposableItemArray, delay: number = 0): void
		{
			deferredUnsafe(disposables && disposables.length ? disposables.slice() : null, delay);
		}

		/**
		 * Namespace for unsafe deferred disposal operations.
		 */
		export namespace deferred
		{
			/**
			 * Disposes an array of objects asynchronously without creating a copy.
			 * 
			 * **WARNING:** This is an unsafe method that operates directly on the provided array.
			 * Use only when you can guarantee that disposal operations will not modify the array
			 * or trigger events that might modify it.
			 * 
			 * @param disposables - Array of objects to dispose. The array is NOT copied.
			 * @param delay - Milliseconds to wait before disposing. Default is 0.
			 * 
			 * @example
			 * ```typescript
			 * // Only use when certain the array won't be modified during disposal
			 * dispose.these.deferred.unsafe(localResourceArray);
			 * ```
			 */
			export function unsafe (disposables: DisposableItemArray, delay: number = 0): void
			{
				deferredUnsafe(disposables, delay);
			}
		}

		/**
		 * Disposes an array of objects without creating a copy of the array.
		 * 
		 * **WARNING:** This is an unsafe method that operates directly on the provided array.
		 * Use only when you can guarantee that disposal operations will not modify the array
		 * or trigger events that might modify it during the disposal process.
		 * 
		 * @param disposables - Array of objects to dispose. The array is NOT copied.
		 * @param trapExceptions - If true, catches exceptions during disposal instead of throwing them.
		 * 
		 * @example
		 * ```typescript
		 * // Only safe when disposal won't modify the array
		 * dispose.these.unsafe(localResourceArray);
		 * ```
		 */
		export function unsafe (disposables: DisposableItemArray, trapExceptions?: boolean): void
		{
			theseUnsafe(disposables, trapExceptions);
		}
	}
}

/**
 * Executes a function with a disposable object and ensures the object is disposed afterward.
 * 
 * This function implements the C#-style 'using' pattern, automatically disposing
 * the provided disposable object after the closure function completes, even if
 * an exception is thrown during execution.
 * 
 * @template TDisposable - The type of disposable object to use.
 * @template TReturn - The return type of the closure function.
 * 
 * @param disposable - The disposable object to use and automatically dispose.
 * @param closure - The function to execute with the disposable object.
 * 
 * @returns The return value of the closure function.
 * 
 * @throws {Error} Any exception thrown by the closure function is re-thrown after disposal.
 * 
 * @example
 * ```typescript
 * // Automatically dispose a database connection after use
 * const result = using(new DatabaseConnection(), (connection) => {
 *   return connection.query('SELECT * FROM users');
 * });
 * // connection.dispose() is automatically called here
 * 
 * // Works even if an exception is thrown
 * try {
 *   using(new FileStream('file.txt'), (stream) => {
 *     throw new Error('Something went wrong');
 *   });
 * } catch (error) {
 *   // stream.dispose() was still called before this catch block
 * }
 * ```
 */
export function using<TDisposable extends Disposable, TReturn> (
	disposable: TDisposable,
	closure: (disposable: TDisposable) => TReturn
): TReturn
{
	try
	{
		return closure(disposable);
	}
	finally
	{
		singleUnsafe(disposable, false);
	}
}

/**
 * Internal function that makes disposing more robust for when there's no type checking.
 * 
 * This function safely disposes an object by checking if it has a dispose method
 * and optionally catching exceptions during disposal.
 * 
 * @param disposable - The object to dispose. Can be null, undefined, or any type.
 * @param trapException - If true, logs exceptions instead of throwing them.
 * 
 * @private
 */
function singleUnsafe (disposable: DisposableItem, trapException?: boolean): void
{
	if(disposable && typeof disposable==='object')
	{
		if(typeof disposable.dispose!=='function') return;
		if(trapException)
		{
			try
			{
				disposable.dispose();
			}
			catch(ex)
			{
				if(typeof console !== 'undefined' && typeof console.error === 'function') {
					console.error('Error during disposal:', ex);
				}
			}
		}
		else disposable.dispose();
	}
}

/**
 * Internal function for disposing arrays of disposables.
 * 
 * **WARNING:** This function assumes it's working on a local array copy and
 * is unsafe for external use as it doesn't create defensive copies.
 * 
 * @param disposables - Array of disposables to dispose.
 * @param trapExceptions - If true, catches exceptions during disposal.
 * 
 * @private
 */
function theseUnsafe (disposables: DisposableItemArray, trapExceptions?: boolean): void
{
	if(!disposables) return;
	for(const d of disposables) singleUnsafe(d, trapExceptions);
}

/**
 * Internal function for deferred disposal of arrays.
 * 
 * **WARNING:** This function assumes it's working on a local array copy and
 * is unsafe for external use as it doesn't create defensive copies.
 * 
 * @param disposables - Array of disposables to dispose.
 * @param delay - Milliseconds to wait before disposal.
 * 
 * @private
 */
function deferredUnsafe (disposables: DisposableItemArray, delay: number = 0): void
{
	if(!disposables || !disposables.length) return;
	setTimeout(theseUnsafe, delay && delay>0 ? delay : 0, disposables, true);
}

export default dispose;
