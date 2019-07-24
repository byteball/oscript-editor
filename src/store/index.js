import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import get from 'lodash/get'

import * as modules from './modules'

Vue.use(Vuex)

export default function () {
	const store = new Vuex.Store({
		modules: Object.entries(modules)
			.map(([key, factory]) => {
				return {
					key,
					value: factory()
				}
			})
			.reduce((t, entry) => ({
				...t,
				[entry.key]: entry.value
			}), {}),
		plugins: [
			createPersistedState({
				key: 'persistedState',
				paths: [ 'ui' ]
			}),
			createPersistedState({
				key: 'persistedAgents',
				paths: [ 'agents.selected', 'agents.userAgents' ],
				getState (name, storage) {
					const state = JSON.parse(storage[name] || '{}')
					return {
						agents: {
							...state.agents,
							selected: get(state, 'agents.selected') || 'template_0'
						}
					}
				}
			})
		]
	})

	return store
}
