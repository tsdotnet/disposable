/*!
 * @author electricessence / https://github.com/electricessence/
 * @license MIT
 */
import type DisposableAware from './DisposableAware';
export default abstract class DisposableBase implements DisposableAware {
    protected _disposableObjectName: string;
    private readonly __disposableState;
    protected constructor(disposableObjectName: string, finalizer?: () => void | null);
    get wasDisposed(): boolean;
    dispose(): void;
    protected throwIfDisposed(message?: string, objectName?: string): true | never;
    protected _onDispose(): void;
}
