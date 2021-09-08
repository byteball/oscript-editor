export default {
	id: 'oscript',
	tokensProvider: {
		// Set defaultToken to invalid to see what you did not tokenize yet
		defaultToken: 'invalid',
		keywords: [
			'if', 'else', 'return', 'true', 'false'
		],
		builtins: [
			'var', 'bounce', 'response', 'response_unit', 'timestamp', 'mci', 'mc_unit', 'this_address', 'base',
			'data_feed', 'in_data_feed',
			'attestation', 'balance',
			'address', 'amount', 'asset', 'attestors', 'ifseveral', 'ifnone', 'type',
			'oracles', 'feed_name', 'min_mci', 'feed_value', 'what',
			'min', 'max', 'pi', 'e', 'sqrt', 'ln', 'ceil', 'floor', 'round', 'abs', 'hypot',
			'is_valid_signed_package', 'sha256', 'is_valid_sig', 'json_parse', 'json_stringify', 'number_from_seed',
			'length', 'is_valid_address', 'substring', 'starts_with', 'ends_with', 'contains',
			'parse_date', 'timestamp_to_string', 'typeof', 'storage_size',
			'is_integer', 'is_valid_amount', 'is_aa', 'index_of', 'array_length', 'is_array', 'is_assoc', 'unit',
			'to_upper', 'to_lower', 'exists', 'number_of_responses', 'vrf_verify', 'definition',
			'delete', 'freeze', 'chash160', 'map', 'reduce', 'split', 'join', 'reverse', 'keys', 'replace',
			'has_only', 'foreach', 'filter', 'previous_aa_responses', 'log', 'require'
		],
		operators: [
			'=', '>', '<', '!', '!!', '?', ':', '==', '<=', '>=', '!=',
			'||', '+', '-', '*', '/', '%', '^',
			'+=', '-=', '*=', '/=', '%=', '||=', 'OR', 'AND', 'NOT', 'OTHERWISE', 'or', 'and', 'not', 'otherwise',
			'=>'
		],
		// we include these common regular expressions
		symbols: /[=><!?:|+\-*/%^]+/,
		// C# style strings
		escapes: /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,
		// The main tokenizer for our languages
		tokenizer: {
			root: [
				// numbers
				[/\d*\.\d+([eE][-+]?\d+)?/, 'number.float'],
				[/\d+([eE][-+]?\d+)?/, 'number'],
				[/[A-Z0-9]{32}\./, 'keyword'],
				// identifiers and keywords
				[/params/, 'keyword'],
				[/trigger\.data/, 'keyword'],
				[/trigger\.address/, 'keyword'],
				[/trigger\.outputs/, 'keyword'],
				[/trigger\.output/, 'keyword'],
				[/trigger\.unit/, 'keyword'],
				[/trigger\.initial_address/, 'keyword'],
				[/trigger\.initial_unit/, 'keyword'],
				[/\w+\b/, { cases: { '@builtins': 'keyword',
					'@keywords': 'keyword',
					'@default': 'identifier'
				} }],
				[/\$\{/, { token: 'variable', next: '@localVariable' }],
				[/\$\w+/, 'variable'],
				// whitespace
				{ include: '@whitespace' },
				// delimiters and operators
				[/[{}()[\]]/, '@brackets'],
				//  [/[<>](?!@symbols)/, '@brackets'],
				[/@symbols/, { cases: { '@operators': 'operator' } }],
				[/OR|or|AND|and|NOT|not|otherwise|OTHERWISE/, 'operator'],
				// delimiter: after number because of .\d floats
				[/[;,.#]/, 'delimiter'],
				// strings
				[/"([^"\\]|\\.)*$/, 'string.invalid'], // non-teminated string
				[/'([^'\\]|\\.)*$/, 'string.invalid'], // non-teminated string
				[/"/, 'string', '@string_double'],
				[/'/, 'string', '@string_single'],
				// characters
				[/'[^\\']'/, 'string'],
				[/(')(@escapes)(')/, ['string', 'string.escape', 'string']],
				[/'/, 'string.invalid']
			],
			comment: [
				[/[^/*]+/, 'comment'],
				[/[/*]/, 'comment']
			],
			localVariable: [
				[/}/, { token: 'variable', next: '@pop' }],
				{ include: 'root' }
			],
			string: [
				[/[^\\"]+/, 'string'],
				[/@escapes/, 'string.escape'],
				[/\\./, 'string.escape.invalid'],
				[/"/, { token: 'string.quote', bracket: '@close', next: '@pop' }]
			],
			string_double: [
				[/[^\\"]+/, 'string'],
				[/@escapes/, 'string.escape'],
				[/\\./, 'string.escape.invalid'],
				[/"/, 'string', '@pop']
			],
			string_single: [
				[/[^\\']+/, 'string'],
				[/@escapes/, 'string.escape'],
				[/\\./, 'string.escape.invalid'],
				[/'/, 'string', '@pop']
			],
			whitespace: [
				[/[ \t\r\n]+/, 'white'],
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
	}
}
