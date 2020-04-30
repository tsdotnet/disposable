/* tslint:disable:variable-name */
/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */

import IDisposableAware from './IDisposableAware';
import ObjectDisposedException from './ObjectDisposedException';

abstract class DisposableBase implements IDisposableAware {
	protected constructor(protected _disposableObjectName: string, private readonly __finalizer?: () => void | null) {}

	private __wasDisposed: boolean = false;

	get wasDisposed(): boolean {
		return this.__wasDisposed;
	}

	/**
	 * Utility for throwing exception when this object is accessed.
	 * @param message
	 * @param objectName Optional object name override.
	 */
	protected throwIfDisposed(message?: string, objectName: string = this._disposableObjectName): true | never {
		if (this.__wasDisposed) throw new ObjectDisposedException(objectName);
		return true;
	}

	// NOTE: Do not override this method.  Override _onDispose instead.
	dispose(): void {
		const _ = this;
		if (!_.__wasDisposed) {
			// Preemptively set wasDisposed in order to prevent repeated disposing.
			// NOTE: in true multi-threaded scenarios, this would need to be synchronized.
			_.__wasDisposed = true;
			try {
				_._onDispose(); // Protected override.
			} finally {
				if (_.__finalizer) {
					// Private finalizer...
					_.__finalizer();
					(_ as any).__finalizer = undefined;
				}
			}
		}
	}

	// Placeholder for overrides.
	// tslint:disable-next-line:no-empty
	/**
	 * Is called when this object is disposed.  Should not be called directly.
	 * Override this method to handle disposal.
	 * @private
	 */
	protected _onDispose(): void {}
}

export default DisposableBase;
