import uniqid from 'uniqid'
import templates from 'src/templates'
import axios from 'axios'
import router from '../../../router.js'

const templatesArray = Object.keys(templates).map((t, index) => ({
	id: 'template_' + index,
	text: templates[t],
	label: t
}))

export const CHANGE_SELECTED = 'agents/selected/change'
export const CREATE_USER_AGENT = 'agents/userAgent/create'
export const SHARE_USER_AGENT = 'agents/userAgent/share'
export const RENAME_USER_AGENT = 'agents/userAgent/rename'
export const DELETE_USER_AGENT = 'agents/userAgent/delete'
export const UPDATE_USER_AGENT_TEXT = 'agents/userAgent/update/text'

export const AGENT_TYPE = {
	TEMPLATE: 'template',
	USER: 'user'
}

export default () => ({
	namespaced: true,
	state: {
		templates: templatesArray,
		userAgents: [],
		selected: 'template_0'
	},
	getters: {
		selectedAgent: state => {
			if (state.selected.startsWith('template')) {
				const agent = state.templates.find(t => t.id === state.selected)
				return {
					...agent,
					type: AGENT_TYPE.TEMPLATE
				}
			} else {
				const agent = state.userAgents.find(t => t.id === state.selected)
				return {
					...agent,
					type: AGENT_TYPE.USER
				}
			}
		},
		isSelectedAgentUser: (state, getters) => {
			const selectedAgent = getters.selectedAgent
			return selectedAgent.type === AGENT_TYPE.USER
		},
		isSelectedAgentTemplate: (state, getters) => {
			const selectedAgent = getters.selectedAgent
			return selectedAgent.type === AGENT_TYPE.TEMPLATE
		}
	},
	mutations: {
		[CHANGE_SELECTED] (state, id) {
			state.selected = id
		},
		[UPDATE_USER_AGENT_TEXT] (state, { userAgentId, text }) {
			state.userAgents.find(a => a.id === userAgentId).text = text
		},
		[CREATE_USER_AGENT] (state, { id, text, label, isShared }) {
			if (!isShared) {
				state.userAgents.unshift({
					id,
					label,
					text
				})
			} else {
				let findOldAgentText = state.userAgents.find(a => a.text === text)
				let findOldAgentLabel = state.userAgents.find(a => a.label === label)
				if (findOldAgentText) {
					findOldAgentText.text = text
					findOldAgentText.id = id
					// This below condition checks. If there is already named label and the old text and if that text === label's state text
				} else if (findOldAgentLabel && findOldAgentText && findOldAgentLabel.text === findOldAgentText.text) {
					findOldAgentLabel.text = text
					findOldAgentLabel.id = id
				} else if (findOldAgentLabel) {
					var inBrackets = findOldAgentLabel.label.trim().match(/\(.*?\)/g)
					if (findOldAgentLabel || inBrackets) {
						if (inBrackets) {
							var wasLabel = findOldAgentLabel.label
							while (state.userAgents.find(a => a.label === wasLabel)) {
								inBrackets = wasLabel.trim().match(/\(.*?\)/g)
								var lastInc = inBrackets[inBrackets.length - 1]
								var toInc = lastInc.match(/\d+/g)
								toInc = parseInt(toInc) + 1
								var nlabel = wasLabel.trim().substring(0, wasLabel.trim().length - 4)
								wasLabel = nlabel + ' (' + toInc + ')'
							}
							state.userAgents.unshift({
								id,
								label: wasLabel,
								text
							})
						} else {
							// If user have copied label without brackets but then open that again
							var nwasLabel = findOldAgentLabel.label
							var labelToGet = nwasLabel + ' (' + 1 + ')'
							if (state.userAgents.find(a => a.label === labelToGet)) {
								while (state.userAgents.find(a => a.label === labelToGet)) {
									inBrackets = labelToGet.trim().match(/\(.*?\)/g)
									let lastInc = inBrackets[inBrackets.length - 1]
									let toInc = lastInc.match(/\d+/g)
									toInc = parseInt(toInc) + 1
									let nlabel = labelToGet.trim().substring(0, labelToGet.trim().length - 4)
									labelToGet = nlabel + ' (' + toInc + ')'
								}
								state.userAgents.unshift({
									id,
									label: labelToGet,
									text
								})
							} else {
								state.userAgents.unshift({
									id,
									label: label + ' (' + 1 + ')',
									text
								})
							}
						}
					}
				} else {
					state.userAgents.unshift({
						id,
						label: label,
						text
					})
				}
			}
		},
		[SHARE_USER_AGENT] (state, id) {
			const agent = state.userAgents.find(a => a.id === id)
			axios({
				url: 'https://api.myjson.com/bins',
				method: 'POST',
				data: { id: agent }
			}).then(function (response) {
				let urlCode = response.data.uri.split('/bins/').pop()
				router.push({ path: '/s/' + urlCode })
				navigator.clipboard.writeText(window.location.href).then(function () {
					window.alert('Url generated and Copied to Clipboard Successfully')
				}, function () {
					window.alert('Url is not Copied to Clipboard, Please try to copy it from address bar.')
				})
			})
		},
		[DELETE_USER_AGENT] (state, id) {
			const index = state.userAgents.findIndex(a => a.id === id)
			if (index !== -1) {
				state.userAgents.splice(index, 1)
			}
		},
		[RENAME_USER_AGENT] (state, { id, newLabel }) {
			const agent = state.userAgents.find(a => a.id === id)
			if (agent) {
				agent.label = newLabel
			}
		}
	},
	actions: {
		async changeSelected ({ commit }, id) {
			commit(CHANGE_SELECTED, id)
		},
		async createNewAgent ({ commit, state, dispatch }, prefix) {
			const id = uniqid('userAgent-')
			const label = await dispatch('getIncrementedLabel', prefix)

			await commit(CREATE_USER_AGENT, {
				id,
				label,
				text: state.templates[0].text
			})
			await commit(CHANGE_SELECTED, id)
		},
		async shareThisAgent ({ commit }, id) {
			await commit(SHARE_USER_AGENT, id)
		},
		async createNewAgentShared ({ commit }, response) {
			const id = uniqid('userAgent-')
			await commit(CREATE_USER_AGENT, {
				id,
				label: response.data.id.label,
				text: response.data.id.text,
				isShared: true
			})
			await commit(CHANGE_SELECTED, id)
		},
		async deleteAgent ({ commit, state }, id) {
			await commit(DELETE_USER_AGENT, id)
			const nextId = state.userAgents.length
				? state.userAgents[0].id
				: state.templates[0].id
			await commit(CHANGE_SELECTED, nextId)
		},
		async renameAgent ({ commit, state }, { id, newLabel }) {
			return commit(RENAME_USER_AGENT, { id, newLabel })
		},
		async updateText ({ commit, getters, dispatch }, text) {
			const agent = getters.selectedAgent
			if (getters.isSelectedAgentUser) {
				commit(UPDATE_USER_AGENT_TEXT, {
					userAgentId: agent.id,
					text
				})
			} else if (getters.isSelectedAgentTemplate) {
				const id = uniqid('userAgent-')
				const label = await dispatch('getIncrementedLabel', agent.label + ' copy')

				await commit(CREATE_USER_AGENT, { id, label, text })
				await commit(CHANGE_SELECTED, id)
			}
		},
		async getIncrementedLabel ({ state }, prefix) {
			const max = state.userAgents
				.filter(a => a.label.startsWith(prefix))
				.reduce((max, cur) => {
					const m = cur.label.match(/\d+$/)
					return m ? Math.max(m[0], max) : max
				}, 0)
			return `${prefix} ${max + 1}`
		}
	}
})
