/*!
 * @author electricessence / https://github.com/electricessence/
 * @license MIT
 */
import type DisposableAware from './DisposableAware';
export default abstract class DisposableStateBase implements DisposableAware {
    private readonly __disposeState;
    protected constructor(finalizer?: () => void | null);
    get wasDisposed(): boolean;
    protected assertIsAlive(strict?: boolean): boolean;
    protected _onBeforeDispose(): void;
    protected _startDispose(): boolean;
    protected _finishDispose(): void;
}
