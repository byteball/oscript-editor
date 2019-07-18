export const SET_THEME = 'ui/settings/theme'
export const SET_WRAP_LINES = 'ui/settings/wrapLines'
export const SET_LAST_INPUT = 'ui/lastInput'

export default () => ({
	namespaced: true,
	state: {
		settings: {
			theme: 'dark',
			wrapLines: true
		},
		lastInput: ''
	},
	mutations: {
		[SET_THEME] (state, theme) {
			state.settings.theme = theme
		},
		[SET_WRAP_LINES] (state, wrapLines) {
			state.settings.wrapLines = wrapLines
		},
		[SET_LAST_INPUT] (state, lastInput) {
			state.lastInput = lastInput
		}
	},
	actions: {
		async setTheme ({ commit }, theme) {
			commit(SET_THEME, theme)
		},
		async setWrapLines ({ commit }, wrapLines) {
			commit(SET_WRAP_LINES, wrapLines)
		},
		async setLastInput ({ commit }, lastInput) {
			commit(SET_LAST_INPUT, lastInput)
		}
	}
})
