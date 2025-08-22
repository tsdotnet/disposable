/*!
 * @author electricessence / https://github.com/electricessence/
 * @license MIT
 */

import AsyncDisposable from './AsyncDisposable';
import DisposableStateBase from './DisposableStateBase';

export default abstract class AsyncDisposableBase
	extends DisposableStateBase implements AsyncDisposable {

	protected constructor(
		finalizer?: () => void | null) {
		super(finalizer);
	}

	// NOTE: Do not override this method.  Override _onDispose instead.
	async disposeAsync(): Promise<void> {
		if (!this._startDispose()) return;
		try { await this._onDisposeAsync(); }
		finally { this._finishDispose(); }
	}

	// Placeholder for overrides.
	/**
   * Is called when this object is disposed.  Should NOT be called directly.
   * Override this method to handle disposal.
   */
	protected _onDisposeAsync(): Promise<void> { return Promise.resolve(); }
}
