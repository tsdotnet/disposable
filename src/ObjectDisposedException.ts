/*!
 * @author electricessence / https://github.com/electricessence/
 * @license MIT
 */

import type DisposableAware from './DisposableAware';

/**
 * Exception thrown when an operation is performed on a disposed object.
 */
export default class ObjectDisposedException extends Error {
	/**
	 * The name of the disposed object.
	 */
	readonly objectName: string;

	/**
	 * @param objectName Name of the disposed object.
	 * @param message Optional error message.
	 */
	constructor(objectName: string, message?: string) {
		super(message ?? `Object '${objectName}' has been disposed and cannot be used.`);
		this.objectName = objectName;
		this.name = 'ObjectDisposedException';
	}

	/**
	 * Throws if the disposable object has been disposed.
	 * @param disposable Object to check.
	 * @param objectName Name for the exception.
	 * @param message Optional error message.
	 */
	static throwIfDisposed(disposable: DisposableAware, objectName: string, message?: string): true | never {
		if (disposable.wasDisposed) throw new ObjectDisposedException(objectName, message);
		return true;
	}
}
