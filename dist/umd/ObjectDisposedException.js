/*!
 * @author electricessence / https://github.com/electricessence/
 * @license MIT
 */
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class ObjectDisposedException extends Error {
        objectName;
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
});
//# sourceMappingURL=ObjectDisposedException.js.map