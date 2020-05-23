/*!
 * @author electricessence / https://github.com/electricessence/
 * @license MIT
 */

import DisposableAware from './DisposableAware';

export default class ObjectDisposedException
	extends Error
{
	readonly objectName: string;

	constructor (objectName: string, message?: string)
	{
		super(message);
		this.objectName = objectName;
	}

	static throwIfDisposed (
		disposable: DisposableAware,
		objectName: string,
		message?: string): true | never
	{
		if(disposable.wasDisposed) throw new ObjectDisposedException(objectName, message);
		return true;
	}
}
