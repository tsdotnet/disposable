"use strict";
/*!
 * @author electricessence / https://github.com/electricessence/
 * @license MIT
 */
Object.defineProperty(exports, "__esModule", { value: true });
class ObjectDisposedException extends Error {
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
exports.default = ObjectDisposedException;
//# sourceMappingURL=ObjectDisposedException.js.map