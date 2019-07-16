import * as monaco from 'monaco-editor'

export default {
	id: 'ojson',
	tokensProvider: {
		defaultToken: 'invalid',
		keyword: [
			'messages', 'bounce_fees', 'app', 'data',
			'payload', 'asset', 'outputs', 'address', 'amount',
			'cases', 'if', 'init', 'state', 'base',
			'cap', 'is_private', 'is_transferrable', 'auto_destroy',
			'fixed_denominations', 'issued_by_definer_only',
			'cosigned_by_definer', 'spender_attested', 'issue_condition',
			'transfer_condition', 'attestors', 'denominations'
		],

		words: [
			'autonomous agent', 'base', 'true', 'false', 'data',
			'payment', 'data_feed', 'profile',
			'text', 'definition', 'asset_attestors',
			'attestation', 'state', 'definition_template',
			'poll', 'vote', 'asset'
		],

		// C# style strings
		escapes: /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,
		whites: /[ \t\r\n]+/,

		tokenizer: {
			root: [
				// identifiers and keywords
				[/[a-z_$][\w$]*/, { cases: {
					'@keyword': 'keyword.ojson',
					'@words': 'variable.predefined',
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
				[/"{/, { token: 'keyword', next: '@oscript_double', nextEmbedded: 'oscript' }],
				[/'{/, { token: 'keyword', next: '@oscript_single', nextEmbedded: 'oscript' }],
				[/`{/, { token: 'keyword', next: '@oscript_backtick', nextEmbedded: 'oscript' }],
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
					'@default': 'autocomplete'
				} }],
				[/@escapes/, 'string.escape'],
				[/\\./, 'string.escape.invalid'],
				[/"/, { token: 'string.quote', bracket: '@close', next: '@pop' }]
			],

			string_single: [
				[/[^\\']+/, { cases: {
					'@words': 'variable.predefined',
					'@default': 'autocomplete'
				} }],
				[/@escapes/, 'string.escape'],
				[/\\./, 'string.escape.invalid'],
				[/'/, { token: 'string.quote', bracket: '@close', next: '@pop' }]
			],
			string_backtick: [
				[/[^\\`]+/, { cases: {
					'@words': 'variable.predefined',
					'@default': 'autocomplete'
				} }],
				[/@escapes/, 'string.escape'],
				[/\\./, 'string.escape.invalid'],
				[/`/, { token: 'string.quote', bracket: '@close', next: '@pop' }]
			],

			oscript_double: [
				[/}"/, { token: 'keyword', next: '@pop', nextEmbedded: '@pop' }]
			],
			oscript_single: [
				[/}'/, { token: 'keyword', next: '@pop', nextEmbedded: '@pop' }]
			],
			oscript_backtick: [
				[/}`/, { token: 'keyword', next: '@pop', nextEmbedded: '@pop' }]
			],

			whitespace: [
				[/@whites/, 'white'],
				[/\/\*/, 'comment', '@comment'],
				[/\/\/.*$/, 'comment']
			]
		}
	},
	conf: {
		brackets: [['{', '}'], ['[', ']'], ['(', ')'], ['"{', '}"'], ['`{', '}`'], ["'{", "}'"]],
		autoClosingPairs: [
			{ open: '{', close: '}' },
			{ open: '[', close: ']' },
			{ open: '(', close: ')' },
			{ open: '"', close: '"' },
			{ open: "'", close: "'" },
			{ open: '`', close: '`' },
			{ open: '"{', close: '}' },
			{ open: "'{", close: '}' },
			{ open: '`{', close: '}' }
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
		const text = model.getValueInRange({
			startLineNumber: 1,
			startColumn: 1,
			endLineNumber: position.lineNumber,
			endColumn: position.column
		})

		for (let i = text.length - 1; i > 0; i--) {
			const pair = text[i - 1] + text[i]
			if (pair === '"{' || pair === '`{' || pair === "'{") {
				return oscriptProposals(model, position)
			} else if (pair === '}"' || pair === '}`' || pair === "}'") {
				break
			}
		}

		const textUntilPosition = model.getValueInRange({
			startLineNumber: position.lineNumber,
			startColumn: 1,
			endLineNumber: position.lineNumber,
			endColumn: position.column
		})

		const match = textUntilPosition.match(/:\s*(\S+)?$/)

		if (match) {
			const word = match[1] || ''

			const quoted = [
				'base', 'data', 'payment', 'data_feed', 'profile',
				'text', 'definition', 'asset_attestors',
				'attestation', 'state', 'definition_template',
				'poll', 'vote', 'asset'
			].map(label => quotedAutocomplete(word, label))

			const keys = [
				'true', 'false'
			].map(key => ({
				label: key,
				kind: monaco.languages.CompletionItemKind.Text,
				insertText: key
			}))

			return [
				...quoted,
				...keys
			]
		} else {
			const keywords = [
				'messages', 'bounce_fees', 'app', 'payload', 'asset', 'outputs',
				'address', 'amount', 'cases', 'if', 'init', 'state', 'base',
				'data', 'cap', 'is_private', 'is_transferrable', 'auto_destroy',
				'fixed_denominations', 'issued_by_definer_only', 'cosigned_by_definer',
				'spender_attested', 'issue_condition', 'transfer_condition',
				'attestors', 'denominations'
			].map(key => ({
				label: key,
				kind: monaco.languages.CompletionItemKind.Keyword,
				insertText: key + ': '
			}))

			const quoted = [
				'autonomous agent'
			].map(label => quotedAutocomplete(textUntilPosition, label))

			const snippets = [
				{
					label: 'if',
					kind: monaco.languages.CompletionItemKind.Snippet,
					insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
					insertText: 'if: `{$0}`,'
				}
			]

			return [
				...keywords,
				...snippets,
				...quoted
			]
		}
	}
}

const quotedAutocomplete = (word, label) => {
	let insertText
	if (word.match(/'\S+$/)) {
		insertText = label
	} else if (word.match(/"\S+$/)) {
		insertText = label
	} else if (word.match(/`\S+$/)) {
		insertText = label
	} else {
		insertText = "'" + label + "'"
	}

	return {
		label,
		kind: monaco.languages.CompletionItemKind.Text,
		insertText
	}
}

const oscriptProposals = (model, position) => {
	const words = [
		'if', 'else', 'return', 'true', 'false',
		'var', 'bounce', 'response', 'response_unit', 'timestamp', 'mci', 'this_address', 'base',
		'data_feed', 'in_data_feed',
		'attestation', 'balance',
		'address', 'amount', 'asset', 'attestors', 'ifseveral', 'ifnone', 'type',
		'oracles', 'feed_name', 'min_mci', 'feed_value', 'what',
		'min', 'max', 'pi', 'e', 'sqrt', 'ln', 'ceil', 'floor', 'round', 'abs', 'hypot',
		'is_valid_signed_package', 'sha256', 'json_parse', 'json_stringify',
		'OR', 'AND', 'NOT', 'OTHERWISE', 'or', 'and', 'not', 'otherwise',
		'this', 'address', 'trigger.data', 'trigger.address', 'trigger.output',
		'trigger.unit'
	]
	return words.map(w => ({
		label: w,
		kind: monaco.languages.CompletionItemKind.Keyword,
		insertText: w
	}))
}
