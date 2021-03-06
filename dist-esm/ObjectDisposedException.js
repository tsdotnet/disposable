/*!
 * @author electricessence / https://github.com/electricessence/
 * @license MIT
 */
export default class ObjectDisposedException extends Error {
    constructor(objectName, message) {
        super(message);
        this.objectName = objectName;
    }
    static throwIfDisposed(disposable, objectName, message) {
        if (disposable.wasDisposed)
            throw new ObjectDisposedException(objectName, message);
        return true;
    }
}
//# sourceMappingURL=ObjectDisposedException.js.map