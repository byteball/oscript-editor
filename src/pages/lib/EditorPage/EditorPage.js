import MonacoEditor from 'vue-monaco'
import debounce from 'lodash/debounce'
import get from 'lodash/get'
import { mapActions, mapState, mapGetters } from 'vuex'
import Multiselect from 'vue-multiselect'
import monacoLanguages from 'src/languages'
import { AgentControls, QrCode } from 'src/components'
import { ValidationError, ParsingError } from 'src/errors'

/* eslint-disable-next-line no-undef */
const config = __APP_CONFIG__
const explorerUrl = config.explorer.url
const ojson = monacoLanguages['ojson']

export default {
	components: {
		QrCode,
		Multiselect,
		MonacoEditor,
		AgentControls
	},
	data () {
		return {
			deploymentUrl: '',
			isDeploying: false,
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
			this.deploymentUrl = ''
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
		this.$refs.editor.getMonaco().focus()
	},
	computed: {
		...mapState({
			theme: state => state.ui.settings.theme,
			wrapLines: state => state.ui.settings.wrapLines,

			templates: state => state.agents.templates,
			userAgents: state => state.agents.userAgents,
			sharedAgents: state => state.agents.sharedAgents
		}),
		...mapGetters({
			selectedAgent: 'agents/selectedAgent',
			isSelectedAgentUser: 'agents/isSelectedAgentUser',
			isSelectedAgentTemplate: 'agents/isSelectedAgentTemplate',
			isSelectedAgentShared: 'agents/isSelectedAgentShared'
		}),
		templateOptions () {
			return [
				...(
					this.userAgents.length
						? [{
							type: 'My Agents',
							agents: this.userAgents
						}]
						: []
				),
				...(
					this.sharedAgents.length
						? [{
							type: 'Shared Agents',
							agents: this.sharedAgents
						}]
						: []
				),
				{
					type: 'Templates',
					agents: this.templates
				}
			]
		},
		agentSelectPrefix () {
			return this.isSelectedAgentShared
				? 'Shared: '
				: this.isSelectedAgentTemplate
					? 'Template: '
					: ''
		},
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
			parseOjson: 'grammars/parseOjson',
			validateAa: 'grammars/validateOjson',

			changeSelectedAgent: 'agents/changeSelected',
			addSharedAgent: 'agents/addSharedAgent',
			createNewAgent: 'agents/createNewAgent',
			deleteUserAgent: 'agents/deleteAgent',
			renameUserAgent: 'agents/renameAgent',
			updateAgentText: 'agents/updateText',

			setWrapLines: 'ui/setWrapLines',
			setTheme: 'ui/setTheme',

			deployAaOnBackend: 'backend/deploy',
			createAgentLink: 'backend/createAgentLink'
		}),
		async codeChanged () {
			this.serializedOjson = ''
			this.resultMessage = ``

			if (this.code !== '') {
				try {
					this.serializedOjson = JSON.stringify(await this.parseOjson(this.code))
				} catch (e) {
					this.openResultPane()
					this.resultMessage = e.message
				}
			}
		},
		async deployAa () {
			this.openResultPane()
			if (config.deployment.delpoyWithUserWallet) {
				try {
					this.deploymentUrl = ''
					const uri = await this.createAgentLink(this.code)
					this.deploymentUrl = uri
					this.resultMessage = 'Agent prepared for deployment\n' +
						'Click on the temporary link below to deploy agent with your local Obyte wallet\n' +
						'Or scan QR code to deploy it with another device'
				} catch (e) {
					this.resultMessage = e.response ? get(e, 'response.data.error', 'Unexpected error') : e.message
				}
			} else {
				try {
					const result = await this.deployAaOnBackend(this.serializedOjson)
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
		async handleDeployClick () {
			this.isDeploying = true
			this.resultMessage = ''
			await this.codeChanged()

			if (this.serializedOjson !== '') {
				await this.deployAa()
			}
			this.isDeploying = false
		},
		async handleValidateClick () {
			this.resultMessage = ''
			await this.codeChanged()

			if (this.serializedOjson !== '') {
				this.openResultPane()
				try {
					const body = await this.validateAa(this.serializedOjson)
					const result = body ? 'AA validated, complexity = ' + body.complexity + ', ops = ' + body.count_ops : 'AA validated'
					this.resultMessage = 'Success\n' + result
				} catch (e) {
					if (e instanceof ValidationError) { this.resultMessage = e.message }
					if (e instanceof ParsingError) { this.resultMessage = e.message }
					this.resultMessage = e.message
				}
			}
		},
		async handleTemplateSelect (agent) {
			await this.changeSelectedAgent(agent.id)
			this.doNotUpdateAgentText = true
			this.code = this.selectedAgent.text
			this.$refs.editor.getMonaco().setScrollPosition({ scrollTop: 0 })
			this.$refs.editor.getMonaco().focus()
			this.deploymentUrl = ''
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
		handleThemeSelect (theme) {
			this.setTheme(theme)
		},
		async handleAgentActionNew () {
			await this.createNewAgent({ label: 'New Agent' })
			this.doNotUpdateAgentText = true
			this.code = this.templates[0].text
			this.$refs.editor.getMonaco().focus()
		},
		async handleAgentActionDelete () {
			await this.deleteUserAgent(this.selectedAgent.id)
			this.doNotUpdateAgentText = true
			this.code = this.selectedAgent.text
			this.$refs.editor.getMonaco().focus()
		},
		async handleAgentActionRename (newLabel) {
			await this.renameUserAgent({ id: this.selectedAgent.id, newLabel })
			this.$refs.editor.getMonaco().focus()
		},
		handleQrClosed () {
			this.resultMessage = ''
		},
		openResultPane () {
			if (!this.resultPaneOpened) {
				this.resultPaneOpened = true
				this.$nextTick(() => {
					this.$refs.resultPaneEditor.getMonaco().getModel().updateOptions(this.resultPaneModelOptions)
				})
			}
		},
		setAgentDropdownPointer () {
			const currentIndex = this.$refs.refAgentDropdown.filteredOptions.findIndex(option => option.id === this.selectedAgent.id)
			this.$refs.refAgentDropdown.pointerSet(currentIndex)
			const scroll = this.$refs.refAgentDropdown.optionHeight * currentIndex
			this.$nextTick(() => {
				this.$refs.refAgentDropdown.$refs.list.scrollTop = scroll
			})
		}
	}
}
