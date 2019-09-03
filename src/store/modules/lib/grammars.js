import { promisify } from 'util'
import { ValidationError, OjsonParsingError } from 'src/errors'

const aaValidation = require('ocore/aa_validation')
const ojson = require('ocore/formula/parse_ojson')

export default () => ({
	namespaced: true,
	actions: {
		async parseOjson ({ commit }, text) {
			try {
				return await promisify(ojson.parse)(text)
			} catch (err) {
				throw new OjsonParsingError(err)
			}
		},
		async validateOjson ({ commit }, ojson) {
			try {
				return await promisify(aaValidation.validateAADefinition)(JSON.parse(ojson))
			} catch (err) {
				throw new ValidationError(err)
			}
		}
	}
})
