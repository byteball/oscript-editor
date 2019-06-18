import Vue from 'vue'
import Vuex from 'vuex'
import { BACKEND } from 'src/remotes'
import templates from 'src/templates'

Vue.use(Vuex)

export default new Vuex.Store({
	state: {
		ojson: {
			templates
		}
	},
	mutations: {

	},
	actions: {
		async 'ojson/deploy' ({ commit }, ojson) {
			const { data } = await BACKEND.post('/ojson/deploy', { data: ojson })
			return data
		}
	}
})
