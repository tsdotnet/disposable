/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */

import Disposable from './Disposable';

export default interface DisposableAware
	extends Disposable
{
	readonly wasDisposed: boolean;
}
