const path = require('path')
const webpack = require('webpack')
const config = require('config')
const MonacoEditorPlugin = require('monaco-editor-webpack-plugin')
const StyleLintPlugin = require('stylelint-webpack-plugin')

module.exports = {
	configureWebpack: {
		devtool: 'source-map',
		plugins: [
			new StyleLintPlugin(),
			new MonacoEditorPlugin({
				languages: ['javascript', 'css', 'html']
			}),
			new webpack.DefinePlugin({
				'__APP_CONFIG__': JSON.stringify(config.get('frontend'))
			})
		]
	},

	chainWebpack: config => {
		config.resolve.alias
			.set('src', path.resolve(__dirname, 'src'))
	}
}
