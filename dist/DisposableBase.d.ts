/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */
import IDisposableAware from './IDisposableAware';
declare abstract class DisposableBase implements IDisposableAware {
    protected _disposableObjectName: string;
    private readonly __finalizer?;
    protected constructor(_disposableObjectName: string, __finalizer?: (() => void | null) | undefined);
    private __wasDisposed;
    get wasDisposed(): boolean;
    /**
     * Utility for throwing exception when this object is accessed.
     * @param message
     * @param objectName Optional object name override.
     */
    protected throwIfDisposed(message?: string, objectName?: string): true | never;
    dispose(): void;
    /**
     * Is called when this object is disposed.  Should not be called directly.
     * Override this method to handle disposal.
     * @private
     */
    protected _onDispose(): void;
}
export default DisposableBase;
