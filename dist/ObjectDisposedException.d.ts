/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 * Based upon: https://msdn.microsoft.com/en-us/library/System.Exception%28v=vs.110%29.aspx
 */
import IDisposableAware from './IDisposableAware';
export default class ObjectDisposedException extends Error {
    readonly objectName: string;
    constructor(objectName: string, message?: string);
    static throwIfDisposed(disposable: IDisposableAware, objectName: string, message?: string): true | never;
}
