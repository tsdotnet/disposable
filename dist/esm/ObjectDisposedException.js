/*!
 * @author electricessence / https://github.com/electricessence/
 * @license MIT
 */
class ObjectDisposedException extends Error {
    objectName;
    constructor(objectName, message) {
        super(message ?? `Object '${objectName}' has been disposed and cannot be used.`);
        this.objectName = objectName;
        this.name = 'ObjectDisposedException';
    }
    static throwIfDisposed(disposable, objectName, message) {
        if (disposable.wasDisposed)
            throw new ObjectDisposedException(objectName, message);
        return true;
    }
}

export { ObjectDisposedException as default };
//# sourceMappingURL=ObjectDisposedException.js.map
