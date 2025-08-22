/*!
 * @author electricessence / https://github.com/electricessence/
 * @license MIT
 */
export declare const enum DisposeState {
    Alive = 0,
    DisposeCalled = 1,
    Disposing = 2,
    Disposed = 3
}
export type DisposeStateValue = typeof DisposeState[keyof typeof DisposeState];
