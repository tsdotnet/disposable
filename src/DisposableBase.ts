/*!
 * @author electricessence / https://github.com/electricessence/
 * @license MIT
 */

import Disposable from './Disposable';
import DisposableStateBase from './DisposableStateBase';

export default abstract class DisposableBase
	extends DisposableStateBase implements Disposable {

	protected constructor(
		finalizer?: () => void | null) {
		super(finalizer);
	}

	// NOTE: Do not override this method.  Override _onDispose instead.
	dispose(): void {
		if (!this._startDispose()) return;
		try { this._onDispose(); }
		finally { this._finishDispose(); }
	}


	// Placeholder for overrides.
	/**
	 * Is called when this object is disposed.  Should NOT be called directly.
	 * Override this method to handle disposal.
	 */
	protected _onDispose(): void { }
}
