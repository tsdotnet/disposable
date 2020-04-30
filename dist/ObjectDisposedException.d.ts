/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */
import DisposableAware from './DisposableAware';
export default class ObjectDisposedException extends Error {
    readonly objectName: string;
    constructor(objectName: string, message?: string);
    static throwIfDisposed(disposable: DisposableAware, objectName: string, message?: string): true | never;
}
