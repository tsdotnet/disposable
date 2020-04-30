/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */
import DisposableAware from './DisposableAware';
declare abstract class DisposableBase implements DisposableAware {
    protected _disposableObjectName: string;
    private readonly __finalizer?;
    private __wasDisposed;
    protected constructor(_disposableObjectName: string, __finalizer?: (() => void | null) | undefined);
    get wasDisposed(): boolean;
    dispose(): void;
    /**
     * Utility for throwing exception when this object is accessed.
     * @param message
     * @param objectName Optional object name override.
     */
    protected throwIfDisposed(message?: string, objectName?: string): true | never;
    /**
     * Is called when this object is disposed.  Should not be called directly.
     * Override this method to handle disposal.
     * @private
     */
    protected _onDispose(): void;
}
export default DisposableBase;
