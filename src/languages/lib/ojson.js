import * as monaco from 'monaco-editor'
import cloneDeep from 'lodash/cloneDeep'
import uniq from 'lodash/uniq'
import { ojsonKeysList, ojsonValuesList, oscriptWordsList } from './words'

export default {
	id: 'ojson',
	tokensProvider: {
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
					'@default': ''
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
					'@keyword': 'keyword.ojson',
					'@words': 'variable.predefined',
					'@default': 'autocomplete'
				} }],
				[/@escapes/, 'string.escape'],
				[/\\./, 'string.escape.invalid'],
				[/"/, { token: 'string.quote', bracket: '@close', next: '@pop' }]
			],

			string_single: [
				[/[^\\']+/, { cases: {
					'@keyword': 'keyword.ojson',
					'@words': 'variable.predefined',
					'@default': 'autocomplete'
				} }],
				[/@escapes/, 'string.escape'],
				[/\\./, 'string.escape.invalid'],
				[/'/, { token: 'string.quote', bracket: '@close', next: '@pop' }]
			],
			string_backtick: [
				[/[^\\`]+/, { cases: {
					'@keyword': 'keyword.ojson',
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
	triggerCharacters: '$',
	suggestions: (model, position) => {
		const lineUntilPosition = model.getValueInRange({
			startLineNumber: position.lineNumber,
			startColumn: 1,
			endLineNumber: position.lineNumber,
			endColumn: position.column
		})

		const makeQuoted = (w) => {
			return w.quoted ? {
				...w,
				insertText: quotedAutocomplete(lineUntilPosition, w.label)
			} : w
		}

		if (isOscript(model, position)) {
			if (lineUntilPosition.search(/\$\S*$/) !== -1) {
				return oscriptVariables(model)
			} else {
				return cloneDeep(oscriptWordsList).map(makeQuoted)
			}
		}

		if (isOjsonValues(model, position)) {
			return cloneDeep(ojsonValuesList).map(makeQuoted)
		} else {
			return cloneDeep(ojsonKeysList).map(makeQuoted)
		}
	},
	hovers: (model, position) => {
		const hover = model.getWordAtPosition(position)
		if (!hover) return

		let hints
		if (isOscript(model, position)) {
			let label = hover.word
			const nextChar = getNextChar(model, position.lineNumber, hover.endColumn)
			if (nextChar === '[' || nextChar === '=' || nextChar === '!') {
				label += nextChar
			} else {
				label = getDotMergedWord(model, position.lineNumber, hover)
			}

			hints = oscriptWordsList.filter(w => (w.label === label || w.labelAlt === label) && w.documentation)
		} else if (isOjsonValues(model, position)) {
			hints = ojsonValuesList.filter(w => w.label === hover.word && w.documentation)
		} else {
			hints = ojsonKeysList.filter(w => w.label === hover.word && w.documentation)
		}

		return hints.length > 0
			? {
				range: new monaco.Range(position.lineNumber, hover.startColumn, position.lineNumber, hover.endColumn),
				contents: hints.map(h => h.documentation)
			}
			: null
	}
}

const isOjsonValues = (model, position) => {
	const lineUntilPosition = model.getValueInRange({
		startLineNumber: position.lineNumber,
		startColumn: 1,
		endLineNumber: position.lineNumber,
		endColumn: position.column
	})

	return lineUntilPosition.match(/:\s*(\S+)?$/)
}

const isOscript = (model, position) => {
	const text = model.getValueInRange({
		startLineNumber: 1,
		startColumn: 1,
		endLineNumber: position.lineNumber,
		endColumn: position.column
	})

	for (let i = text.length - 1; i > 0; i--) {
		const pair = text[i - 1] + text[i]
		if (pair === '"{' || pair === '`{' || pair === "'{") {
			return true
		} else if (pair === '}"' || pair === '}`' || pair === "}'") {
			return false
		}
	}
}

const oscriptVariables = (model, position) => {
	const text = model.getValue()
	return uniq(text.match(/\$[A-Za-z_]+/g)).map(e => ({
		label: e.slice(1),
		insertText: e.slice(1),
		kind: monaco.languages.CompletionItemKind.Variable
	}))
}

const quotedAutocomplete = (textUntilPosition, label) => {
	let insertText
	if (textUntilPosition.match(/'\S+$/)) {
		insertText = label
	} else if (textUntilPosition.match(/"\S+$/)) {
		insertText = label
	} else if (textUntilPosition.match(/`\S+$/)) {
		insertText = label
	} else {
		insertText = "'" + label + "'"
	}

	return insertText
}

const getCharWithOffset = (model, lineNumber, column, offset) => {
	const range = {
		startColumn: column,
		endColumn: column + offset,
		startLineNumber: lineNumber,
		endLineNumber: lineNumber
	}
	return model.getValueInRange(range)
}

const getNextChar = (model, lineNumber, column) => getCharWithOffset(model, lineNumber, column, 1)
const getPrevChar = (model, lineNumber, column) => getCharWithOffset(model, lineNumber, column, -1)

const getDotMergedWord = (model, lineNumber, { startColumn, endColumn, word }) => {
	if (getPrevChar(model, lineNumber, startColumn) === '.') {
		const prev = model.getWordAtPosition({ lineNumber, column: startColumn - 2 }).word
		return `${prev}.${word}`
	} else if (getNextChar(model, lineNumber, endColumn) === '.') {
		const next = model.getWordAtPosition({ lineNumber, column: endColumn + 2 }).word
		return `${word}.${next}`
	} else {
		return word
	}
}
