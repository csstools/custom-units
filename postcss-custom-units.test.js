const postcss = require('postcss');

const PostCSSPlugin = require('./postcss-custom-units.cjs');


const getResultCss = (css, pluginOptions = {}) =>
	postcss([PostCSSPlugin(pluginOptions)])
		.process(css, { from: undefined })
		.then(({ css }) => css);

describe('PostCSSPlugin', () => {
	it('Predefined units', async () => {
		const res = await getResultCss(`
			.f {
				width: 200ijk;
				height: -5fbb;
				margin: 5--rs;
				padding: 10px;
				padding-left: var(--fbb);
			}
		`, {
			units: ['ijk', 'fbb'],
		});

		expect(res).toBe(`
			.f {
				width: max(200 * var(--ijk));
				height: max(-5 * var(--fbb));
				margin: max(5 * var(--rs));
				padding: 10px;
				padding-left: var(--fbb);
			}
		`);
	});
});
