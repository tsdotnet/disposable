/*!
 * @author electricessence / https://github.com/electricessence/
 * @license MIT
 */

import type Disposable from './Disposable';
import type DisposableAware from './DisposableAware';
import DisposableBase from './DisposableBase';
import dispose from './dispose';
import ObjectDisposedException from './ObjectDisposedException';

export {Disposable, DisposableAware, ObjectDisposedException, dispose, DisposableBase};

export default DisposableBase;
