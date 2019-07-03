import * as monaco from 'monaco-editor'

export default {
	id: 'ojson',
	tokensProvider: {
		defaultToken: 'invalid',
		keyword: [
			'messages', 'bounce_fees', 'app', 'data',
			'payload', 'asset', 'outputs', 'address', 'amount',
			'cases', 'if', 'else', 'init', 'state', 'base',
			'cap', 'is_private', 'is_transferrable', 'auto_destroy',
			'fixed_denominations', 'issued_by_definer_only',
			'cosigned_by_definer', 'spender_attested', 'issue_condition',
			'transfer_condition', 'attestors', 'denominations'
		],

		words: [
			'autonomous agent', 'payment', 'base', 'state', 'true', 'false'
		],

		// C# style strings
		escapes: /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,
		whites: /[ \t\r\n]+/,

		tokenizer: {
			root: [
				// identifiers and keywords
				[/[a-z_$][\w$]*/, { cases: {
					'@keyword': 'keyword.ojson',
					'@words': 'predefined',
					'@default': 'invalid'
				} }],

				// whitespace
				{ include: '@whitespace' },

				// delimiters and operators
				[/[{}[\]]/, '@brackets'],

				// numbers
				[/\d*\.\d+([eE][-+]?\d+)?/, 'number.float'],
				[/0[xX][0-9a-fA-F]+/, 'number.hex'],
				[/\d+/, 'number'],

				// delimiter: after number because of .\d floats
				[/[;,.:]/, 'delimiter'],

				// strings
				[/"{/, { token: 'string', next: '@oscript_double', nextEmbedded: 'oscript' }],
				[/'{/, { token: 'string', next: '@oscript_single', nextEmbedded: 'oscript' }],
				[/`{/, { token: 'string', next: '@oscript_backtick', nextEmbedded: 'oscript' }],
				[/"/, { token: 'string.quote', bracket: '@open', next: '@string_double' }],
				[/`/, { token: 'string.quote', bracket: '@open', next: '@string_backtick' }],
				[/'/, { token: 'string.quote', bracket: '@open', next: '@string_single' }],

				// characters
				[/'[^\\']'/, 'string'],
				[/(')(@escapes)(')/, ['string', 'string.escape', 'string']],
				[/'/, 'string.invalid']
			],

			comment: [
				[/[^/*]+/, 'comment'],
				[/\/\*/, 'comment', '@push'], // nested comment
				['\\*/', 'comment', '@pop'],
				[/[/*]/, 'comment']
			],

			string_double: [
				[/[^\\"]+/, { cases: {
					'@words': 'variable.predefined',
					'@default': 'string'
				} }],
				[/@escapes/, 'string.escape'],
				[/\\./, 'string.escape.invalid'],
				[/"/, { token: 'string.quote', bracket: '@close', next: '@pop' }]
			],

			string_single: [
				[/[^\\']+/, { cases: {
					'@words': 'variable.predefined',
					'@default': 'string'
				} }],
				[/@escapes/, 'string.escape'],
				[/\\./, 'string.escape.invalid'],
				[/'/, { token: 'string.quote', bracket: '@close', next: '@pop' }]
			],
			string_backtick: [
				[/[^\\`]+/, { cases: {
					'@words': 'variable.predefined',
					'@default': 'string'
				} }],
				[/@escapes/, 'string.escape'],
				[/\\./, 'string.escape.invalid'],
				[/`/, { token: 'string.quote', bracket: '@close', next: '@pop' }]
			],

			oscript_double: [
				[/}"/, { token: 'string', next: '@pop', nextEmbedded: '@pop' }]
			],
			oscript_single: [
				[/}'/, { token: 'string', next: '@pop', nextEmbedded: '@pop' }]
			],
			oscript_backtick: [
				[/}`/, { token: 'string', next: '@pop', nextEmbedded: '@pop' }]
			],

			whitespace: [
				[/@whites/, 'white'],
				[/\/\*/, 'comment', '@comment'],
				[/\/\/.*$/, 'comment']
			]
		}
	},
	conf: {
		brackets: [['{', '}'], ['[', ']'], ['(', ')']],
		autoClosingPairs: [
			{ open: '{', close: '}' },
			{ open: '[', close: ']' },
			{ open: '(', close: ')' },
			{ open: '"', close: '"' },
			{ open: "'", close: "'" },
			{ open: '`', close: '`' }
		],
		surroundingPairs: [
			{ open: '{', close: '}' },
			{ open: '[', close: ']' },
			{ open: '(', close: ')' },
			{ open: '"', close: '"' },
			{ open: "'", close: "'" },
			{ open: '`', close: '`' }
		],
		comments: {
			lineComment: '//',
			blockComment: ['/*', '*/']
		}
	},
	proposals: (model, position) => {
		const keys = [
			{
				label: 'messages',
				kind: monaco.languages.CompletionItemKind.Keyword,
				insertText: 'messages'
			},
			{
				label: 'bounce_fees',
				kind: monaco.languages.CompletionItemKind.Keyword,
				insertText: 'bounce_fees'
			},
			{
				label: 'app',
				kind: monaco.languages.CompletionItemKind.Keyword,
				insertText: 'app'
			},
			{
				label: 'payload',
				kind: monaco.languages.CompletionItemKind.Keyword,
				insertText: 'payload'
			},
			{
				label: 'asset',
				kind: monaco.languages.CompletionItemKind.Keyword,
				insertText: 'asset'
			},
			{
				label: 'outputs',
				kind: monaco.languages.CompletionItemKind.Keyword,
				insertText: 'outputs'
			},
			{
				label: 'address',
				kind: monaco.languages.CompletionItemKind.Keyword,
				insertText: 'address'
			},
			{
				label: 'amount',
				kind: monaco.languages.CompletionItemKind.Keyword,
				insertText: 'amount'
			},
			{
				label: 'cases',
				kind: monaco.languages.CompletionItemKind.Keyword,
				insertText: 'cases'
			},
			{
				label: 'else',
				kind: monaco.languages.CompletionItemKind.Keyword,
				insertText: 'else'
			},
			{
				label: 'if',
				kind: monaco.languages.CompletionItemKind.Keyword,
				insertText: 'if'
			},
			{
				label: 'init',
				kind: monaco.languages.CompletionItemKind.Keyword,
				insertText: 'init'
			},
			{
				label: 'state',
				kind: monaco.languages.CompletionItemKind.Keyword,
				insertText: 'state'
			},
			{
				label: 'base',
				kind: monaco.languages.CompletionItemKind.Keyword,
				insertText: 'base'
			},
			{
				label: 'data',
				kind: monaco.languages.CompletionItemKind.Keyword,
				insertText: 'data'
			},
			{
				label: 'cap',
				kind: monaco.languages.CompletionItemKind.Keyword,
				insertText: 'cap'
			},
			{
				label: 'is_private',
				kind: monaco.languages.CompletionItemKind.Keyword,
				insertText: 'is_private'
			},
			{
				label: 'is_transferrable',
				kind: monaco.languages.CompletionItemKind.Keyword,
				insertText: 'is_transferrable'
			},
			{
				label: 'auto_destroy',
				kind: monaco.languages.CompletionItemKind.Keyword,
				insertText: 'auto_destroy'
			},
			{
				label: 'fixed_denominations',
				kind: monaco.languages.CompletionItemKind.Keyword,
				insertText: 'fixed_denominations'
			},
			{
				label: 'issued_by_definer_only',
				kind: monaco.languages.CompletionItemKind.Keyword,
				insertText: 'issued_by_definer_only'
			},
			{
				label: 'cosigned_by_definer',
				kind: monaco.languages.CompletionItemKind.Keyword,
				insertText: 'cosigned_by_definer'
			},
			{
				label: 'spender_attested',
				kind: monaco.languages.CompletionItemKind.Keyword,
				insertText: 'spender_attested'
			},
			{
				label: 'issue_condition',
				kind: monaco.languages.CompletionItemKind.Keyword,
				insertText: 'issue_condition'
			},
			{
				label: 'transfer_condition',
				kind: monaco.languages.CompletionItemKind.Keyword,
				insertText: 'transfer_condition'
			},
			{
				label: 'attestors',
				kind: monaco.languages.CompletionItemKind.Keyword,
				insertText: 'attestors'
			},
			{
				label: 'denominations',
				kind: monaco.languages.CompletionItemKind.Keyword,
				insertText: 'denominations'
			},
			{
				label: 'autonomous agent',
				kind: monaco.languages.CompletionItemKind.Text,
				insertText: "'autonomous agent'"
			},
			{
				label: 'if',
				kind: monaco.languages.CompletionItemKind.Snippet,
				insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				insertText: 'if: `{$0}`,'
			}
		]
		const values = [
			{
				label: 'payment',
				kind: monaco.languages.CompletionItemKind.Text,
				insertText: "'payment'"
			},
			{
				label: 'base',
				kind: monaco.languages.CompletionItemKind.Text,
				insertText: "'base'"
			},
			{
				label: 'state',
				kind: monaco.languages.CompletionItemKind.Text,
				insertText: "'state'"
			},
			{
				label: 'false',
				kind: monaco.languages.CompletionItemKind.Text,
				insertText: 'false'
			},
			{
				label: 'true',
				kind: monaco.languages.CompletionItemKind.Text,
				insertText: 'true'
			}
		]
		const textUntilPosition = model.getValueInRange({
			startLineNumber: position.lineNumber,
			startColumn: 1,
			endLineNumber: position.lineNumber,
			endColumn: position.column
		})

		return textUntilPosition.match(/:\s*(\S+)?$/)
			? values
			: keys
	}
}
