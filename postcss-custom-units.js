import parseValue from 'postcss-value-parser'

/** @type {import('postcss').PluginCreator} */
const PostCSSPlugin = ({ units = [] } = {}) => {
	const matchCustomNumber = getMatchCustomNumber(units);

	return {
		postcssPlugin: 'postcss-custom-units',
		Declaration (declaration) {
			const declarationValue = declaration.value

			if (!declarationValue.includes('--') && !units.some((unit) => declarationValue.includes(unit))) return

			const declarationAST = parseValue(declarationValue)

			declarationAST.walk(node => {
				if (node.type !== 'word') return

				const value = (node.value.match(matchCustomNumber) || [])[0]

				if (!value) return

				let unit = node.value.slice(value.length)

				if (!unit.startsWith('--')) unit = '--' + unit

				Object.assign(node, {
					type: 'function',
					value: 'max',
					nodes: [
						{ type: 'word', value },
						{ type: 'space', value: ' ' },
						{ type: 'word', value: '*' },
						{ type: 'space', value: ' ' },
						{
							type: 'function',
							value: 'var',
							nodes: [
								{ type: 'word', value: unit }
							]
						}
					]
				})
			})

			const modifiedValue = declarationAST.toString()

			if (declarationValue !== modifiedValue) {
				declaration.value = modifiedValue
			}
		},
	}
}

PostCSSPlugin.postcss = true

const getMatchCustomNumber = (units = []) => {
	const endings = ['--', ...units]
		.map(ending => `(?:${ending})`)

	return new RegExp(`^[-+]?\\d*\.?\\d+(?:[eE][-+]?\\d+)?(?=${endings.join('|')})`);
}

export default PostCSSPlugin
