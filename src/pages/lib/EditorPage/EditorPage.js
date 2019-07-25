import MonacoEditor from 'vue-monaco'
import isArray from 'lodash/isArray'
import debounce from 'lodash/debounce'
import get from 'lodash/get'
import { mapActions, mapState, mapGetters } from 'vuex'
import monacoLanguages from 'src/languages'
import { AgentControls } from 'src/components'
import { ValidationError, ParsingError } from 'src/errors'

const TYPES = {
	IF: 'IF',
	INT: 'INT',
	STR: 'STR',
	APP: 'APP',
	MAIN: 'MAIN',
	INIT: 'INIT',
	PAIR: 'PAIR',
	TRUE: 'TRUE',
	CASE: 'CASE',
	CASES: 'CASES',
	FALSE: 'FALSE',
	STATE: 'STATE',
	ARRAY: 'ARRAY',
	OBJECT: 'OBJECT',
	DECIMAL: 'DECIMAL',
	FORMULA: 'FORMULA',
	PAYLOAD: 'PAYLOAD',
	MESSAGE: 'MESSAGE',
	MESSAGES: 'MESSAGES',
	BOUNCE_FEES: 'BOUNCE_FEES',
	BOUNCE_ASSET: 'BOUNCE_ASSET'
}

/* eslint-disable-next-line no-undef */
const config = __APP_CONFIG__
const explorerUrl = config.explorer.url
const ojson = monacoLanguages['ojson']

export default {
	components: {
		MonacoEditor,
		AgentControls
	},
	data () {
		return {
			serializedOjson: '',
			language: ojson.id,
			code: '',
			template: '',
			doNotUpdateAgentText: true,
			resultMessage: '',
			resultPaneOpened: false,
			resultPaneEditorOptions: {
				lineNumbers: 'off',
				readOnly: true,
				scrollBeyondLastLine: false,
				automaticLayout: true,
				minimap: {
					enabled: false
				}
			},
			resultPaneModelOptions: {
				tabSize: 1
			},
			editorOptions: {
				wordWrap: 'on',
				wrappingIndent: 'same',
				scrollBeyondLastLine: false,
				automaticLayout: true
			}
		}
	},
	watch: {
		code () {
			if (this.doNotUpdateAgentText) {
				this.doNotUpdateAgentText = false
			} else {
				this.updateAgentText(this.code)
			}
			this.debouncedCodeChanged()
		}
	},
	created () {
		this.debouncedCodeChanged = debounce(this.codeChanged, 500, { trailing: true })
		this.code = this.selectedAgent.text || ''
	},
	mounted () {
		this.switchEditorWrapLines(this.wrapLines)
	},
	computed: {
		...mapState({
			theme: state => state.ui.settings.theme,
			wrapLines: state => state.ui.settings.wrapLines,

			templates: state => state.agents.templates,
			userAgents: state => state.agents.userAgents
		}),
		...mapGetters({
			selectedAgent: 'agents/selectedAgent',
			isSelectedAgentUser: 'agents/isSelectedAgentUser',
			isSelectedAgentTemplate: 'agents/isSelectedAgentTemplate'
		}),
		badge () {
			switch (config.mode) {
			case 'development':
				return 'develop'
			case 'testnet':
				return 'testnet'
			default:
				return ''
			}
		}
	},
	methods: {
		...mapActions({
			parseOscript: 'grammars/parseOscript',
			parseOjson: 'grammars/parseOjson',

			validateAa: 'backend/validate',
			deployAa: 'backend/deploy',

			changeSelectedAgent: 'agents/changeSelected',
			createNewAgent: 'agents/createNewAgent',
			deleteUserAgent: 'agents/deleteAgent',
			renameUserAgent: 'agents/renameAgent',
			updateAgentText: 'agents/updateText',

			setWrapLines: 'ui/setWrapLines',
			setTheme: 'ui/setTheme'
		}),
		async codeChanged () {
			this.serializedOjson = ''
			this.resultMessage = ``

			if (this.code !== '') {
				try {
					const parserResult = await this.parseOjson(this.code)
					this.serializedOjson = await this.serializeOjson(parserResult)
				} catch (e) {
					this.openResultPane()
					this.resultMessage = e.message
				}
			}
		},
		async deploy () {
			this.resultMessage = ''
			await this.codeChanged()

			if (this.serializedOjson !== '') {
				this.openResultPane()
				try {
					const result = await this.deployAa(this.serializedOjson)
					const unit = get(result, 'result.unit', null)
					const definitionMessage = get(unit, 'messages', []).find(m => m.app === 'definition')
					this.resultMessage = 'Success\n' +
						(unit ? `Check in explorer: ${explorerUrl}#${unit.unit}\n` : '') +
						(definitionMessage ? `Agent address: ${definitionMessage.payload.address}` : '')
				} catch (e) {
					this.resultMessage = e.response ? get(e, 'response.data.error', 'Unexpected error') : e.message
				}
			}
		},
		async validate () {
			this.resultMessage = ''

			await this.codeChanged()
			if (this.serializedOjson !== '') {
				this.openResultPane()
				try {
					await this.validateAa(this.serializedOjson)
					this.resultMessage = 'Success'
				} catch (e) {
					if (e instanceof ValidationError) { this.resultMessage = e.message }
					if (e instanceof ParsingError) { this.resultMessage = e.message }
					this.resultMessage = e.message
				}
			}
		},
		async serializeOjson (parserResult) {
			if (!isArray(parserResult)) {
				throw new Error('parserResult should be Array')
			}
			if (parserResult.length !== 1) {
				throw new Error('parserResult should be Array of length 1')
			}
			return JSON.stringify(['autonomous agent', await this.processTree(parserResult[0])])
		},
		async processTree (tree) {
			if (tree.type === TYPES.MAIN) {
				return this.processAsObject(tree)
			} else if (tree.type === TYPES.MESSAGES) {
				return { messages: await this.processTree(tree.value) }
			} else if (tree.type === TYPES.ARRAY) {
				return this.processAsArray(tree)
			} else if (tree.type === TYPES.CASES) {
				return { cases: await this.processAsArray(tree) }
			} else if (tree.type === TYPES.CASE) {
				return this.processAsObject(tree)
			} else if (tree.type === TYPES.BOUNCE_FEES) {
				const fees = {}
				for (let i = 0; i < tree.value.length; i++) {
					const asset = tree.value[i]
					if (fees.hasOwnProperty(asset.asset)) throw new Error(`Duplicate asset '${asset.asset}' at line ${asset.context.line} col ${asset.context.col}`)
					fees[asset.asset] = await this.processTree(asset.value)
				}
				return { bounce_fees: fees }
			} else if (tree.type === TYPES.INT) {
				return tree.value
			} else if (tree.type === TYPES.STR) {
				return tree.value
			} else if (tree.type === TYPES.TRUE) {
				return tree.value
			} else if (tree.type === TYPES.FALSE) {
				return tree.value
			} else if (tree.type === TYPES.DECIMAL) {
				return tree.value
			} else if (tree.type === TYPES.FORMULA) {
				const formula = tree.value
				try {
					await this.parseOscript(formula)
					return '{' + formula + '}'
				} catch (e) {
					const msg = e.message
					const match = msg.match(/invalid syntax at line ([\d]+) col ([\d]+):([\s\S]+)/m)
					if (match) {
						throw new Error(`Invalid formula syntax at line ${tree.context.line + Number(match[1]) - 1} col ${tree.context.col + Number(match[2]) - 1}:${match[3]}`)
					} else {
						throw new Error(`Invalid formula starting at line ${tree.context.line} col ${tree.context.col}`)
					}
				}
			} else if (tree.type === TYPES.INIT) {
				return { init: await this.processTree(tree.value) }
			} else if (tree.type === TYPES.MESSAGE) {
				return this.processAsObject(tree)
			} else if (tree.type === TYPES.PAYLOAD) {
				return { payload: await this.processTree(tree.value) }
			} else if (tree.type === TYPES.OBJECT) {
				return this.processAsObject(tree)
			} else if (tree.type === TYPES.IF) {
				return { if: await this.processTree(tree.value) }
			} else if (tree.type === TYPES.STATE) {
				return { state: await this.processTree(tree.value) }
			} else if (tree.type === TYPES.APP) {
				return { app: tree.value }
			} else if (tree.type === TYPES.PAIR) {
				return { [await this.processTree(tree.key)]: await this.processTree(tree.value) }
			} else {
				throw new Error(`Unknown type ${tree.type}`)
			}
		},
		async processAsObject (tree) {
			const obj = {}
			for (let i = 0; i < tree.value.length; i++) {
				const st = tree.value[i]
				const res = await this.processTree(st)
				const key = Object.keys(res)[0]
				const value = Object.values(res)[0]
				if (obj.hasOwnProperty(key)) throw new Error(`Duplicate key '${key}' at line ${st.context.line} col ${st.context.col}`)
				obj[key] = value
			}
			return obj
		},
		async processAsArray (tree) {
			const arr = []
			for (let i = 0; i < tree.value.length; i++) {
				const st = tree.value[i]
				const res = await this.processTree(st)
				arr.push(res)
			}
			return arr
		},
		async handleTemplateSelect (event) {
			const selected = event.target.value
			await this.changeSelectedAgent(selected)
			this.doNotUpdateAgentText = true
			this.code = this.selectedAgent.text
			this.$refs.editor.getMonaco().setScrollPosition({ scrollTop: 0 })
			this.resultMessage = ''
		},
		handleWrapLinesCheckbox () {
			const newWrapLines = !this.wrapLines
			this.switchEditorWrapLines(newWrapLines)
			this.setWrapLines(newWrapLines)
		},
		switchEditorWrapLines (wrapLines) {
			if (wrapLines) {
				this.$refs.editor.getMonaco().updateOptions({ wordWrap: 'on' })
			} else {
				this.$refs.editor.getMonaco().updateOptions({ wordWrap: 'off' })
			}
		},
		handleThemeSelect (event) {
			const theme = event.target.value
			this.setTheme(theme)
		},
		async handleAgentActionNew () {
			await this.createNewAgent('New Agent')
			this.doNotUpdateAgentText = true
			this.code = this.templates[0].text
		},
		async handleAgentActionDelete () {
			await this.deleteUserAgent(this.selectedAgent.id)
			this.doNotUpdateAgentText = true
			this.code = this.selectedAgent.text
		},
		async handleAgentActionRename (newLabel) {
			await this.renameUserAgent({ id: this.selectedAgent.id, newLabel })
		},
		openResultPane () {
			if (!this.resultPaneOpened) {
				this.resultPaneOpened = true
				this.$nextTick(() => {
					this.$refs.resultPaneEditor.getMonaco().getModel().updateOptions(this.resultPaneModelOptions)
				})
			}
		}
	}
}
