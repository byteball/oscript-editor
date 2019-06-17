const path = require('path')
const MonacoEditorPlugin = require('monaco-editor-webpack-plugin')
const StyleLintPlugin = require('stylelint-webpack-plugin')

module.exports = {
	configureWebpack: {
		devtool: 'source-map',
		plugins: [
			new StyleLintPlugin(),
			new MonacoEditorPlugin({
				languages: ['javascript', 'css', 'html']
			})
		]
	},

	chainWebpack: config => {
		config.resolve.alias
			.set('src', path.resolve(__dirname, 'src'))
	}
}
