/*!
 * @author electricessence / https://github.com/electricessence/
 * @license MIT
 */
import Disposable from './Disposable';
import DisposableStateBase from './DisposableStateBase';
export default abstract class DisposableBase extends DisposableStateBase implements Disposable {
    protected constructor(finalizer?: () => void | null);
    dispose(): void;
    protected _onDispose(): void;
}
