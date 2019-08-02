import { promisify } from 'util'
import nearley from 'nearley'
import { UndefinedGrammarError, ValidationError } from 'src/errors'

const aaValidation = require('ocore/aa_validation')
const ojsonGrammar = require('src/languages/lib/grammars/ojson.js')
const oscriptGrammar = require('ocore/formula/grammar.js')

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
		},
		async validateOjson ({ commit }, ojson) {
			try {
				await promisify(aaValidation.validateAADefinition)(JSON.parse(ojson))
			} catch (err) {
				throw new ValidationError(err)
			}
		}
	}
})
