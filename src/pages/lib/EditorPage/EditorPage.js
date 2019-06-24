import MonacoEditor from 'vue-monaco'
import isString from 'lodash/isString'
import isObject from 'lodash/isObject'
import get from 'lodash/get'
import * as RRJSON from 'really-relaxed-json'
import { mapActions, mapState } from 'vuex'
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
			code: '',
			resultMessage: '',
			resultPaneOpened: false,
			resultPaneHeight: '14',
			resultPaneEditorOptions: {
				lineNumbers: 'off',
				readOnly: true,
				scrollBeyondLastLine: false,
				automaticLayout: true,
				minimap: {
					enabled: false
				}
			}
		}
	},
	created () {
		this.code = this.templates.simple_aa
	},
	computed: {
		...mapState({
			templates: state => state.aa.templates
		})
	},
	methods: {
		...mapActions({
			validateAa: 'aa/validate',
			deployAa: 'aa/deploy'
		}),
		async deploy () {
			this.resultMessage = ''
			this.resultPaneOpened = true
			try {
				const ojson = this.serializeOjson(this.code)
				const result = await this.deployAa(ojson)
				console.log('result', result)
				const unitAddress = get(result, 'result.unit.unit', null)
				this.resultMessage = 'Success\n' +
					(unitAddress ? `Agent has been deployed in unit ${unitAddress}\n` : '') +
					JSON.stringify(get(result, 'result', ''), null, 2)
			} catch (e) {
				console.error('Deployment error:', { ...e })
				this.resultMessage = e.response ? get(e, 'response.data.error', 'Unexpected error') : e.message
			}
		},
		async validate () {
			this.resultMessage = ''
			this.resultPaneOpened = true

			try {
				const ojson = this.serializeOjson(this.code)
				const result = await this.validateAa(ojson)
				console.log('result', result)
				this.resultMessage = 'Success'
			} catch (e) {
				console.error('Validation error:', { ...e })
				this.resultMessage = e.response ? get(e, 'response.data.error', 'Unexpected error') : e.message
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

			const json = JSON.stringify(ojson)
			if (json.includes('<EMBEDDED_OSCRIPT_')) {
				throw new Error('Parsing error')
			}

			return json
		},
		templateSelect (event) {
			const template = event.target.value
			this.code = this.templates[template]
			this.$refs.editor.getMonaco().setScrollPosition({ scrollTop: 0 })
			this.resultMessage = ''
		}
	}
}
