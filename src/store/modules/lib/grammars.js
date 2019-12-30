import { promisify } from 'util'
import { ValidationError, OjsonParsingError } from 'src/errors'

const ValidationUtils = require('ocore/validation_utils')
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
		async validateOjson ({ commit, dispatch }, ojson) {
			let template, definition
			try {
				definition = JSON.parse(ojson)
				template = definition[1]
			} catch (err) {
				throw new ValidationError(err)
			}

			if ('messages' in template) {
				try {
					return await promisify(aaValidation.validateAADefinition)(definition)
				} catch (err) {
					throw new ValidationError(err)
				}
			} else {
				await dispatch('validateParameterizedAA', template)
			}
		},
		async validateParameterizedAA ({ commit }, template) {
			if (ValidationUtils.hasFieldsExcept(template, ['base_aa', 'params'])) {
				throw new ValidationError('foreign fields in parameterized AA definition')
			}
			if (!ValidationUtils.isNonemptyObject(template.params)) {
				throw new ValidationError('no params in parameterized AA')
			}
			if (!ValidationUtils.isValidAddress(template.base_aa)) {
				throw new ValidationError('base_aa is not a valid address')
			}
		}
	}
})
