export default {
	id: 'result-highlighter',
	tokensProvider: {
		tokenizer: {
			root: [
				[/^Success.*/, { token: 'comment', next: '@success' }],
				[/^Agent prepared for deployment*/, { token: 'comment', next: '@success' }],
				[/^.*/, { token: 'string', next: '@string' }]
			],
			success: [
				[/.*/, 'comment']
			],
			string: [
				[/.*/, 'string']
			]
		}
	}
}
