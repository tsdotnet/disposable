/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */

import DisposableAware from './DisposableAware';
import ObjectDisposedException from './ObjectDisposedException';

export default abstract class DisposableBase
	implements DisposableAware
{
	private __wasDisposed: boolean = false;

	protected constructor (
		protected _disposableObjectName: string,
		private readonly __finalizer?: () => void | null)
	{}

	get wasDisposed (): boolean
	{
		return this.__wasDisposed;
	}

	// NOTE: Do not override this method.  Override _onDispose instead.
	dispose (): void
	{
		if(!this.__wasDisposed)
		{
			// Preemptively set wasDisposed in order to prevent repeated disposing.
			// NOTE: in true multi-threaded scenarios, this would need to be synchronized.
			this.__wasDisposed = true;
			try
			{
				this._onDispose(); // Protected override.
			}
			finally
			{
				if(this.__finalizer)
				{
					// Private finalizer...
					this.__finalizer();
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					(this as any).__finalizer = undefined;
				}
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
		if(this.__wasDisposed) throw new ObjectDisposedException(objectName);
		return true;
	}

	// Placeholder for overrides.
	/**
	 * Is called when this object is disposed.  Should NOT be called directly.
	 * Override this method to handle disposal.
	 */
	protected _onDispose (): void
	// eslint-disable-next-line @typescript-eslint/no-empty-function
	{}
}
