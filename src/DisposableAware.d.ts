/*!
 * @author electricessence / https://github.com/electricessence/
 * @license MIT
 */

import Disposable from './Disposable';

export default interface DisposableAware
	extends Disposable
{
	readonly wasDisposed: boolean;
}
