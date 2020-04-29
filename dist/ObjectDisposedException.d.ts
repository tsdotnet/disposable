/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */
import IDisposableAware from './IDisposableAware';
export default class ObjectDisposedException extends Error {
    readonly objectName: string;
    constructor(objectName: string, message?: string);
    static throwIfDisposed(disposable: IDisposableAware, objectName: string, message?: string): true | never;
}
