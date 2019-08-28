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
export const ADD_SHARED_AGENT = 'agents/sharedAgent/add'
export const DELETE_SHARED_AGENT = 'agents/sharedAgent/delete'
export const RENAME_SHARED_AGENT = 'agents/sharedAgent/rename'

export const AGENT_TYPE = {
	TEMPLATE: 'template',
	USER: 'user',
	SHARED: 'shared'
}

export default () => ({
	namespaced: true,
	state: {
		templates: templatesArray,
		userAgents: [],
		sharedAgents: [],
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
			} else if (state.selected.startsWith('sharedAgent')) {
				const agent = state.sharedAgents.find(t => t.id === state.selected)
				return {
					...agent,
					type: AGENT_TYPE.SHARED
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
		},
		isSelectedAgentShared: (state, getters) => {
			const selectedAgent = getters.selectedAgent
			return selectedAgent.type === AGENT_TYPE.SHARED
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
				text,
				label
			})
		},
		[ADD_SHARED_AGENT] (state, { id, text, label, shortcode }) {
			state.sharedAgents.unshift({
				id,
				text,
				label,
				shortcode
			})
		},
		[DELETE_USER_AGENT] (state, id) {
			const index = state.userAgents.findIndex(a => a.id === id)
			if (index !== -1) {
				state.userAgents.splice(index, 1)
			}
		},
		[DELETE_SHARED_AGENT] (state, id) {
			const index = state.sharedAgents.findIndex(a => a.id === id)
			if (index !== -1) {
				state.sharedAgents.splice(index, 1)
			}
		},
		[RENAME_USER_AGENT] (state, { id, newLabel }) {
			const agent = state.userAgents.find(a => a.id === id)
			if (agent) {
				agent.label = newLabel
			}
		},
		[RENAME_SHARED_AGENT] (state, { id, newLabel }) {
			const agent = state.sharedAgents.find(a => a.id === id)
			if (agent) {
				agent.label = newLabel
			}
		}
	},
	actions: {
		async changeSelected ({ commit }, id) {
			commit(CHANGE_SELECTED, id)
		},
		async createNewAgent ({ commit, state, dispatch }, { label, text }) {
			const id = uniqid('userAgent-')

			await commit(CREATE_USER_AGENT, {
				id,
				label: await dispatch('getIncrementedLabel', label),
				text: text || state.templates[0].text
			})
			await commit(CHANGE_SELECTED, id)
		},
		async addSharedAgent ({ commit, state, dispatch }, { label, text, shortcode }) {
			const id = uniqid('sharedAgent-')

			await commit(ADD_SHARED_AGENT, {
				id,
				shortcode,
				label: await dispatch('getSharedLabel', label),
				text: text || state.templates[0].text
			})
			await commit(CHANGE_SELECTED, id)
		},
		async deleteAgent ({ commit, state, getters }, id) {
			if (getters.isSelectedAgentUser) {
				await commit(DELETE_USER_AGENT, id)
			} else if (getters.isSelectedAgentShared) {
				await commit(DELETE_SHARED_AGENT, id)
			}

			const nextId = state.userAgents.length
				? state.userAgents[0].id
				: state.sharedAgents.length
					? state.sharedAgents[0].id
					: state.templates[0].id
			await commit(CHANGE_SELECTED, nextId)
		},
		async renameAgent ({ commit, state, getters }, { id, newLabel }) {
			if (getters.isSelectedAgentUser) {
				return commit(RENAME_USER_AGENT, { id, newLabel })
			} else if (getters.isSelectedAgentShared) {
				return commit(RENAME_SHARED_AGENT, { id, newLabel })
			}
		},
		async updateText ({ commit, getters, dispatch }, text) {
			const agent = getters.selectedAgent
			if (getters.isSelectedAgentUser) {
				commit(UPDATE_USER_AGENT_TEXT, {
					userAgentId: agent.id,
					text
				})
			} else if (getters.isSelectedAgentTemplate || getters.isSelectedAgentShared) {
				const id = uniqid('userAgent-')
				const label = await dispatch('getUserAgentLabel', agent.label + ' copy')

				await commit(CREATE_USER_AGENT, { id, label, text })
				await commit(CHANGE_SELECTED, id)
			}
		},
		async getIncrementedLabel ({ state }, { prefix, agentsArray }) {
			const max = agentsArray
				.filter(a => a.label.match(new RegExp(`^${prefix}( \\d+)?$`)))
				.reduce((max, cur) => {
					if (cur.label === prefix) {
						return Math.max(max, 0)
					}
					const m = cur.label.match(/\d+$/)
					return m ? Math.max(m[0], max) : max
				}, -1)
			const postfix = max === -1
				? ''
				: max === 0
					? ' 2'
					: ` ${max + 1}`
			return prefix + postfix
		},
		async getUserAgentLabel ({ state, dispatch }, prefix) {
			return dispatch('getIncrementedLabel', { prefix, agentsArray: state.userAgents })
		},
		async getSharedLabel ({ state, dispatch }, prefix) {
			return dispatch('getIncrementedLabel', { prefix, agentsArray: state.sharedAgents })
		},
		async getExistingSharedAgent ({ state }, text) {
			return state.sharedAgents.find(agent => agent.text === text)
		}
	}
})
