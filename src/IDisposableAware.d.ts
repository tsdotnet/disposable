/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */

import IDisposable from './IDisposable';

export default interface IDisposableAware extends IDisposable {
	readonly wasDisposed: boolean;
}
