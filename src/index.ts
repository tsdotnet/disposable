/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */

import IDisposable from './IDisposable';
import IDisposableAware from './IDisposableAware';
import ObjectDisposedException from './ObjectDisposedException';
import DisposableBase from './DisposableBase';
import dispose from './dispose';

export { IDisposable, IDisposableAware, ObjectDisposedException, dispose, DisposableBase };

export default DisposableBase;
