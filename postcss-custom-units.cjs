const parseValue = require('postcss-value-parser')

/** @type {import('postcss').PluginCreator} */
const PostCSSPlugin = () => ({
	postcssPlugin: 'postcss-custom-units',
	Declaration(declaration) {
		// ignore any declarations whose values do not include a double-dashes
		if (!declaration.value.includes('--')) return

		/** Declaration value with transformations applied. */
		const transformedValue = parseValue(declaration.value).walk(node => {
			// ignore any nodes that are not a word
			if (node.type !== 'word') return

			/* Number extracted from the node proceeded by a custom property. */
			const [ value ] = node.value.match(matchCustomNumber) || []

			// ignore any words that did not produce a value
			if (!value) return

			/* Unit extracted from the remaining portion of the word. */
			const unit = node.value.slice(value.length)

			// update the node to be a calc() of the custom unit in a var()
			Object.assign(node, {
				type: 'function',
				value: 'calc',
				nodes: [
					{
						type: 'function',
						value: 'var',
						nodes: [
							{ type: 'word', value: unit }
						]
					}
				],
			})

			// when the value does not equal 1, use the value as a multiplier
			if (Number(value) !== 1) {
				node.nodes.unshift(
					{ type: 'word', value },
					{ type: 'space', value: ' ' },
					{ type: 'word', value: '*' },
					{ type: 'space', value: ' ' }
				)
			}
		}).toString()

		// if the value has changed, update the declaration node
		if (declaration.value !== transformedValue) {
			declaration.value = transformedValue
		}
	},
})

PostCSSPlugin.postcss = true

/** Regular expression used to match a CSS number before a custom property. */
const matchCustomNumber = /^[-+]?\d*\.?\d+(?:[eE][-+]?\d+)?(?=--)/

module.exports = PostCSSPlugin
