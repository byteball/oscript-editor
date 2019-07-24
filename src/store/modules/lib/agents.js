import uniqid from 'uniqid'
import templates from 'src/templates'

const templatesArray = Object.keys(templates).map((t, index) => ({
	id: 'template_' + index,
	text: templates[t],
	label: t
}))

export const CHANGE_SELECTED = 'agents/selected/change'
export const CREATE_USER_AGENT = 'agents/userAgent/create'
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
		[CREATE_USER_AGENT] (state, { id, text, label }) {
			state.userAgents.unshift({
				id,
				label,
				text
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
		async createNewAgent ({ commit }, label) {
			const id = uniqid('userAgent-')
			await commit(CREATE_USER_AGENT, {
				id,
				label,
				text: ''
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
		async updateText ({ commit, getters }, text) {
			const agent = getters.selectedAgent
			if (getters.isSelectedAgentUser) {
				commit(UPDATE_USER_AGENT_TEXT, {
					userAgentId: agent.id,
					text
				})
			} else if (getters.isSelectedAgentTemplate) {
				const id = uniqid('userAgent-')
				const label = agent.label + ' copy'
				await commit(CREATE_USER_AGENT, { id, label, text })
				await commit(CHANGE_SELECTED, id)
			}
		}
	}
})
