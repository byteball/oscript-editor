import MonacoEditor from 'vue-monaco'
import isString from 'lodash/isString'
import isObject from 'lodash/isObject'
import * as RRJSON from 'really-relaxed-json'
import monacoLanguages from 'src/languages'

const ojson = monacoLanguages['ojson']

export default {
	components: {
		MonacoEditor
	},
	data () {
		return {
			theme: 'dark',
			language: ojson.id,
			code: ojson.codeStub,
			error: ''
		}
	},
	methods: {
		deploy () {
			this.error = ''
			try {
				this.serializeOjson(this.code)
			} catch (e) {
				this.error = e.message
			}
		},
		serializeOjson (input) {
			const embeddedOscript = {}
			let embeddedCounter = 0
			// find embedded oscript parts
			const code = input.replace(/(`\s*\{((?!\}\s*`)[\s\S])+}\s*`|'\s*\{((?!\}\s*')[\s\S])+}\s*'|"\s*\{((?!\}\s*")[\s\S])+}\s*")/g, (whole, part) => {
				const key = `<EMBEDDED_OSCRIPT_${embeddedCounter}>`
				embeddedOscript[key] = part.slice(1, -1).trim()
				embeddedCounter++
				return key
			})
			const ojson = JSON.parse(RRJSON.toJson(code))

			function rehydrateEmbeddedOscript (obj) {
				for (const key in obj) {
					if (isString(obj[key]) && obj[key] in embeddedOscript) {
						obj[key] = embeddedOscript[obj[key]]
					} else if (isObject(obj[key])) {
						rehydrateEmbeddedOscript(obj[key])
					}
					if (key in embeddedOscript) {
						obj[embeddedOscript[key]] = obj[key]
						delete obj[key]
					}
				}
			}

			if (Object.keys(embeddedOscript).length) {
				rehydrateEmbeddedOscript(ojson)
			}

			console.log('code', code)
			console.log('embeddedOscript', embeddedOscript)
			console.log('ojson', ojson)
			const json = JSON.stringify(ojson)
			if (json.includes('<EMBEDDED_OSCRIPT_')) {
				throw new Error('Parsing error')
			}
		}
	}
}
