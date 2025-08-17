/*!
 * @author electricessence / https://github.com/electricessence/
 * @license MIT
 */

import type Disposable from './Disposable';

// Allows for more flexible parameters.
export type DisposableItem = Disposable | null | undefined;
export type DisposableItemArray = DisposableItem[] | null | undefined;

/* eslint-disable @typescript-eslint/no-namespace */

/**
 * Takes any number of disposables as arguments and attempts to dispose them.
 * Any exceptions thrown within a dispose are not trapped.
 * Use 'dispose.withoutException' to automatically trap exceptions.
 * @param disposables The objects to dispose of. Can accept <any> and will ignore objects that don't have a dispose() method.
 */
export function dispose (...disposables: DisposableItem[]): void
{
	// The disposables arguments array is effectively localized so it's safe.
	theseUnsafe(disposables, false);
}

export namespace dispose
{
	/**
	 * Use this when only disposing one object to avoid creation of arrays.
	 * @param disposable
	 * @param trapException
	 */
	export function single (disposable: DisposableItem, trapException: boolean = false): void
	{
		if(disposable) singleUnsafe(disposable, trapException);
	}

	/**
	 * Takes any number of disposables as arguments and attempts to dispose them after a zero timeout.
	 * All exceptions are logged but not thrown.
	 * @param disposables The objects to dispose of. Can accept <any> and will ignore objects that don't have a dispose() method.
	 */
	export function deferred (...disposables: DisposableItem[]): void
	{
		// The disposables arguments array is effectively localized so it's safe.
		these.deferred.unsafe(disposables);
	}

	/**
	 * Takes any number of disposables and traps any errors that occur when disposing.
	 * Returns an array of the exceptions thrown.
	 * @param disposables The objects to dispose of. Can accept <any> and will ignore objects that don't have a dispose() method.
	 */
	export function withoutException (...disposables: DisposableItem[]): void
	{
		// The disposables arguments array is effectively localized so it's safe.
		theseUnsafe(disposables, true);
	}

	/**
	 * Takes an array of disposable objects and ensures they are disposed.
	 * @param disposables The objects to dispose of. Can accept <any> and will ignore objects that don't have a dispose() method.
	 * @param trapExceptions If true, prevents exceptions from being thrown when disposing.
	 */
	export function these (disposables: DisposableItemArray, trapExceptions?: boolean): void
	{
		if(!disposables || !disposables.length) return;
		theseUnsafe(disposables.slice(), trapExceptions);
	}

	export namespace these
	{
		/**
		 * Takes any number of disposables as arguments and attempts to dispose them after a zero timeout.
		 * Exceptions are logged but not thrown.
		 * @param disposables The objects to dispose of. Can accept <any> and will ignore objects that don't have a dispose() method.
		 * @param delay Milliseconds to wait before disposing.  Default is zero (0).  A higher number could have detrimental consequences or could improve foreground performance.
		 */
		// tslint:disable-next-line:no-shadowed-variable
		export function deferred (disposables: DisposableItemArray, delay: number = 0): void
		{
			deferredUnsafe(disposables && disposables.length ? disposables.slice() : null, delay);
		}

		export namespace deferred
		{
			/**
			 * Takes any number of disposables as arguments and attempts to dispose them after a zero timeout.
			 * Exceptions are logged but not thrown.
			 * WARNING: Use this unsafe method when guaranteed not to cause events that will make modifications to the disposables array.
			 * @param disposables The objects to dispose of. Can accept <any> and will ignore objects that don't have a dispose() method.
			 * @param delay Milliseconds to wait before disposing.  Default is zero (0).  A higher number could have detrimental consequences or could improve foreground performance.
			 */
			export function unsafe (disposables: DisposableItemArray, delay: number = 0): void
			{
				deferredUnsafe(disposables, delay);
			}
		}

		/**
		 * Takes an array of disposable objects and ensures they are disposed.
		 * WARNING: Use this unsafe method when guaranteed not to cause events that will make modifications to the disposables array.
		 * @param disposables The objects to dispose of. Can accept <any> and will ignore objects that don't have a dispose() method.
		 * @param trapExceptions If true, prevents exceptions from being thrown when disposing.
		 */
		export function unsafe (disposables: DisposableItemArray, trapExceptions?: boolean): void
		{
			theseUnsafe(disposables, trapExceptions);
		}
	}
}

/**
 * Just like in C# this 'using' function will ensure the passed disposable is disposed when the closure has finished.
 *
 * Usage:
 * ```typescript
 * using(new DisposableObject(),(myObj)=>{
 *   // do work with myObj
 * });
 * // myObj automatically has it's dispose method called.
 * ```
 *
 * @param disposable Object to be disposed.
 * @param closure Function call to execute.
 * @returns {TReturn} Returns whatever the closure's return value is.
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
 * This private function makes disposing more robust for when there's no type checking.
 * If trapException is 'true' it logs any exception instead of throwing.
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
				console.error(ex);
			}
		}
		else disposable.dispose();
	}
}

/*
 * The following  dispose methods assume they're working on a local arrayCopy and it's unsafe for external use.
 */

function theseUnsafe (disposables: DisposableItemArray, trapExceptions?: boolean): void
{
	if(!disposables) return;
	for(const d of disposables) singleUnsafe(d, trapExceptions);
}

function deferredUnsafe (disposables: DisposableItemArray, delay: number = 0): void
{
	if(!disposables || !disposables.length) return;
	setTimeout(theseUnsafe, delay && delay>0 ? delay : 0, disposables, true);
}

export default dispose;
