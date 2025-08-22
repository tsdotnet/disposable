/*!
 * @author electricessence / https://github.com/electricessence/
 * @license MIT
 */

// Allows for simple type checking that includes types that don't declare themselves as IDisposable but do have a dispose() method.
export default interface AsyncDisposable
{
	disposeAsync(): Promise<void>;
}
