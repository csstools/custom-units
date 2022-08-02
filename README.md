<a href="https://www.npmjs.com/package/@csstools/custom-units" target="_blank"><img src="https://img.shields.io/npm/v/@csstools/custom-units?color=%23444&label=&labelColor=%23CB0000&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjE1MCAxNTAgNDAwIDQwMCIgZmlsbD0iI0ZGRiI+PHBhdGggZD0iTTE1MCA1NTBoMjAwVjI1MGgxMDB2MzAwaDEwMFYxNTBIMTUweiIvPjwvc3ZnPg==&style=for-the-badge" alt="PostCSS Custom Units" align="right" valign="middle" height="32" /></a>

# PostCSS Custom Units

**PostCSS Custom Units** lets you use custom units in CSS, following the [CSSWG Proposal](https://github.com/w3c/csswg-drafts/issues/7379).

```pcss
:root {
  /** Step (approximately 4px when 1rem is 16px) */
  --step: .25rem;

  /** Relative Pixel (approximately 1px when 1rem is 16px) */
  --rpx: .0625rem;
}

.my-component {
  font-size: 24--rpx;
  padding-inline: 3--step;
}

/* becomes */

:root {
  /** Step (approximately 4px when 1rem is 16px) */
  --step: .25rem;

  /** Relative Pixel (approximately 1px when 1rem is 16px) */
  --rpx: .0625rem;
}

.my-component {
  font-size: max(24 * var(--rpx));
  padding-inline: max(3 * var(--step));
}
```

## Usage

Add **PostCSS Custom Units** to your project:

```shell
npm install @csstools/custom-units --save-dev
```

Use **PostCSS Custom Units** to process your CSS:

```js
const postcssCustomUnits = require('@csstools/custom-units');

postcssCustomUnits.process(YOUR_CSS /*, processOptions, pluginOptions */);
```

Or use it as a **PostCSS** plugin:

```js
const postcss = require('postcss');
const postcssCustomUnits = require('@csstools/custom-units');

postcss([
  postcssCustomUnits(/* pluginOptions */)
]).process(YOUR_CSS /*, processOptions */);
```
