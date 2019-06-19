import { BACKEND } from 'src/remotes'
import templates from 'src/templates'

export default () => ({
	namespaced: true,
	state: {
		templates
	},
	mutations: {

	},
	actions: {
		async validate ({ commit }, ojson) {
			const { data } = await BACKEND.post('/aa/validate', { data: ojson })
			return data
		},
		async deploy ({ commit }, ojson) {
			const { data } = await BACKEND.post('/aa/deploy', { data: ojson })
			return data
		}
	}
})
