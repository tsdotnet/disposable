/*!
 * @author electricessence / https://github.com/electricessence/
 * @license MIT
 */

import type DisposableAware from './DisposableAware';
import ObjectDisposedException from './ObjectDisposedException';

export default abstract class DisposableBase
implements DisposableAware
{
	/**
	 * @private
	 * @ignore
	 */
	protected _disposableObjectName: string;
	// Using an object allows for sub classes to 'freeze' themselves without causing and error when disposing.
	private readonly __disposableState: { disposed: boolean, finalizer?: () => void };

	protected constructor (
		disposableObjectName: string,
		finalizer?: () => void | null)
	{
		this._disposableObjectName = disposableObjectName;
		this.__disposableState = {
			disposed: false,
			...(finalizer && { finalizer })
		};
	}

	get wasDisposed (): boolean
	{
		return this.__disposableState.disposed;
	}

	// NOTE: Do not override this method.  Override _onDispose instead.
	dispose (): void
	{
		const state = this.__disposableState;
		if(!state.disposed)
		{
			// Preemptively set wasDisposed in order to prevent repeated disposing.
			// NOTE: in true multi-threaded scenarios, this would need to be synchronized.
			state.disposed = true;
			const finalizer = state.finalizer;
			delete state.finalizer;
			Object.freeze(state);
			try
			{
				this._onDispose(); // Protected override.
			}
			finally
			{
				if(finalizer) finalizer();
			}
		}
	}

	/**
	 * Utility for throwing exception when this object is accessed.
	 * @param message
	 * @param objectName Optional object name override.
	 */
	protected throwIfDisposed (
		message?: string,
		objectName: string = this._disposableObjectName): true | never
	{
		if(this.__disposableState.disposed) throw new ObjectDisposedException(objectName);
		return true;
	}

	// Placeholder for overrides.
	/**
	 * Is called when this object is disposed.  Should NOT be called directly.
	 * Override this method to handle disposal.
	 */
	protected _onDispose (): void {}
}
