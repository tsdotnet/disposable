/*!
 * @author electricessence / https://github.com/electricessence/
 * @license MIT
 */

import Disposable from './Disposable';
import DisposableStateBase from './DisposableStateBase';

/**
 * Complete disposable implementation with state tracking and disposal lifecycle.
 * Extends DisposableStateBase and implements Disposable.
 */
export default abstract class DisposableBase
	extends DisposableStateBase implements Disposable {

	/**
	 * @param finalizer Optional callback executed after disposal.
	 * @protected
	 */
	protected constructor(
		finalizer?: () => void | null) {
		super(finalizer);
	}

	/**
	 * Disposes the object. Idempotent - safe to call multiple times.
	 * Do not override - implement _onDispose() instead.
	 */
	dispose(): void {
		if (!this._startDispose()) return;
		try { this._onDispose(); }
		finally { this._finishDispose(); }
	}

	/**
	 * Override this method to implement disposal logic.
	 * Called once during disposal process.
	 * @protected
	 */
	protected _onDispose(): void { }
}
