const postcss = require('postcss');

const PostCSSPlugin = require('./postcss-custom-units.cjs');

const getResultCss = (css) => postcss([
	PostCSSPlugin
]).process(css, {
	from: undefined
}).then(
	({ css }) => css
)

describe('PostCSSPlugin', () => {
	it('Common positive case', async () => {
		const res = await getResultCss('.f { f: 200--rs; }');

		expect(res).toBe('.f { f: calc(200 * var(--rs)); }');
	});

	it('Common negative case', async () => {
		const res = await getResultCss('.f { f: -200--rs; }');

		expect(res).toBe('.f { f: calc(-200 * var(--rs)); }');
	});

	it('Ignore case', async () => {
		const css = '.f { f: 200px; }';
		const res = await getResultCss(css);

		expect(res).toBe(css);
	});

	it('In calc', async () => {
		const res = await getResultCss('.f { f: calc(2 * -200--rs); }');

		expect(res).toBe('.f { f: calc(2 * calc(-200 * var(--rs))); }');
	});

	it('Fraction case', async () => {
		const res = await getResultCss('.f { f: 2.5--rs; }');

		expect(res).toBe('.f { f: calc(2.5 * var(--rs)); }');
	});

	it('Complex case', async () => {
		const res = await getResultCss(`
			.f {
				width: 200px;
				height: 100--f;
				margin: -5--rs;
			}

			@media (max-width: 300px) {
				width: 200px;
				height: calc(2 * 2--rs);
				margin: 2.5--rs;
			}
		`);

		expect(res).toBe(`
			.f {
				width: 200px;
				height: calc(100 * var(--f));
				margin: calc(-5 * var(--rs));
			}

			@media (max-width: 300px) {
				width: 200px;
				height: calc(2 * calc(2 * var(--rs)));
				margin: calc(2.5 * var(--rs));
			}
		`);
	});

	it('One case', async () => {
		const res = await getResultCss('.f { f: 1--rs; }');

		expect(res).toBe('.f { f: calc(var(--rs)); }');
	});

	it('Zero case', async () => {
		const res = await getResultCss('.f { f: 0--rs; }');

		expect(res).toBe('.f { f: calc(0 * var(--rs)); }');
	});
});
