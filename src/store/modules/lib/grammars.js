import nearley from 'nearley'
import { UndefinedGrammarError } from 'src/errors'

const ojsonGrammar = require('src/languages/lib/grammars/ojson.js')

// TBD reqiring oscript grammar file results empty module, avoiding this behavior by getting grammar from window.grammar
require('src/languages/lib/grammars/oscript.js')
const oscriptGrammar = window.grammar

export default () => ({
	namespaced: true,
	state: {
		ojson: ojsonGrammar,
		oscript: oscriptGrammar
	},
	actions: {
		async parse ({ state }, { text, grammar: grammarName }) {
			const grammar = state[grammarName]
			if (!grammar) {
				throw new UndefinedGrammarError(`Grammar '${grammarName}' undefined`)
			}
			const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar))
			parser.feed(text)
			return parser.results
		},
		async parseOjson ({ dispatch }, text) {
			return dispatch('parse', { text, grammar: 'ojson' })
		},
		async parseOscript ({ dispatch }, text) {
			return dispatch('parse', { text, grammar: 'oscript' })
		}
	}
})
