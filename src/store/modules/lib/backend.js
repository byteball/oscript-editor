import { BACKEND } from 'src/remotes'

export default () => ({
	namespaced: true,
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
