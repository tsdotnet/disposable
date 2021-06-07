/*!
 * @author electricessence / https://github.com/electricessence/
 * @license MIT
 */
import DisposableAware from './DisposableAware';
export default abstract class DisposableBase implements DisposableAware {
    /**
     * @private
     * @ignore
     */
    protected _disposableObjectName: string;
    private readonly __disposableState;
    protected constructor(disposableObjectName: string, finalizer?: () => void | null);
    get wasDisposed(): boolean;
    dispose(): void;
    /**
     * Utility for throwing exception when this object is accessed.
     * @param message
     * @param objectName Optional object name override.
     */
    protected throwIfDisposed(message?: string, objectName?: string): true | never;
    /**
     * Is called when this object is disposed.  Should NOT be called directly.
     * Override this method to handle disposal.
     */
    protected _onDispose(): void;
}
