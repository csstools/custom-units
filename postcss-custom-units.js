import parseValue from 'postcss-value-parser'

/** @type {import('postcss').PluginCreator} */
const PostCSSPlugin = () => {
	return {
		postcssPlugin: 'postcss-custom-units',
		Declaration (declaration) {
			const declarationValue = declaration.value

			if (!declarationValue.includes('--')) return

			const declarationAST = parseValue(declarationValue)

			declarationAST.walk(node => {
				if (node.type !== 'word') return

				const value = (node.value.match(matchCustomNumber) || [])[0]

				console.log({ value })

				if (!value) return

				const unit = node.value.slice(value.length)

				Object.assign(node, {
					type: 'function',
					value: 'calc',
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

const matchCustomNumber = /^[-+]?\d*\.?\d+(?:[eE][-+]?\d+)?(?=--)/

export default PostCSSPlugin
