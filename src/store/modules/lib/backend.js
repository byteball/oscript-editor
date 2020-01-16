import { BACKEND } from 'src/remotes'

/* eslint-disable-next-line no-undef */
const config = __APP_CONFIG__

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
		},
		async createAgentLink ({ commit }, agentString) {
			const { data } = await BACKEND.post('/link', agentString, {
				headers: {
					'Content-Type': 'text/plain'
				},
				responseType: 'json'
			})

			if (!data.shortcode) {
				throw new Error('No shortcode in response')
			}
			return `${config.deployment.protocol}:data?app=definition&definition=${config.api.url}link/${data.shortcode}`
		}
	}
})
