export default {
	id: 'ojson',
	tokensProvider: {
		keywords: [
			'true', 'false'
		],

		// C# style strings
		escapes: /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,
		whites: /[ \t\r\n]+/,

		tokenizer: {
			root: [
				// identifiers and keywords
				[/[a-z_$][\w$]*/, { cases: { '@keywords': 'keyword',
					'@default': '' } }],

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
				[/[^\\"]+/, 'string'],
				[/@escapes/, 'string.escape'],
				[/\\./, 'string.escape.invalid'],
				[/"/, { token: 'string.quote', bracket: '@close', next: '@pop' }]
			],

			string_single: [
				[/[^\\']+/, 'string'],
				[/@escapes/, 'string.escape'],
				[/\\./, 'string.escape.invalid'],
				[/'/, { token: 'string.quote', bracket: '@close', next: '@pop' }]
			],
			string_backtick: [
				[/[^\\`]+/, 'string'],
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
	}
}
