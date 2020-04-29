/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */

// Allows for simple type checking that includes types that don't declare themselves as IDisposable but do have a dispose() method.
export default interface IDisposable {
	dispose(): void;
}
