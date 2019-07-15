module.exports = {
	root: true,
	env: {
		node: true
	},
	'extends': [
		'plugin:vue/essential',
		'@vue/standard'
	],
	rules: {
		'indent': ['error', 'tab'],
		'no-tabs': 'off',
		'no-console': process.env.NODE_ENV === 'development' ? 'off' : 'error',
		'no-debugger': 'error',
		'no-warning-comments': ['error', { 'terms': ['fixme'], 'location': 'start' }]
	},
	parserOptions: {
		parser: 'babel-eslint'
	}
}
