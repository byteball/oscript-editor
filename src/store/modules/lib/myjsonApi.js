import { MYJSON_API } from 'src/remotes'

export default () => ({
	namespaced: true,
	actions: {
		async upload ({ commit }, object) {
			const { data } = await MYJSON_API.post('/bins', object)
			const shortcode = data.uri.split('/').slice(-1)
			return shortcode
		},
		async download ({ commit }, shortcode) {
			const { data } = await MYJSON_API.get(`/bins/${shortcode}`)
			return data
		}
	}
})
