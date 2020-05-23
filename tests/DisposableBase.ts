import {expect} from 'chai';
import DisposableBase from '../src';


class MyDisposable
	extends DisposableBase
{
	constructor (finalizer?: () => void)
	{
		super('MyDisposable', finalizer);
	}

	test (): void
	{
		this.throwIfDisposed();
	}
}

describe('DisposableBase', () => {
	it('should have a proper life cycle', () => {
		let wasFinalized = false;
		const d = new MyDisposable(() => wasFinalized = true);
		expect(d.wasDisposed).to.be.false;
		expect(() => d.test()).not.to.throw();
		d.dispose();
		expect(d.wasDisposed).to.be.true;
		expect(() => d.test()).to.throw();
		expect(wasFinalized).to.be.true;
	});
});
