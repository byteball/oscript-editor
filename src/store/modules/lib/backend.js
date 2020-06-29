import { BACKEND } from 'src/remotes'
import constants from 'ocore/constants'

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
			return `${constants.bTestnet ? 'obyte-tn' : 'obyte'}:data?app=definition&definition=${config.api.url}link/${data.shortcode}`
		},
		async isAgentDuplicate ({ commit }, ojson) {
			const { data } = await BACKEND.post('/aa/is-duplicate', { data: ojson })
			return data
		},
		async getAgent ({ commit }, shortcode) {
			const { data } = await BACKEND.get(`/link/${shortcode}`)
			return data
		},
		async uploadSharedAgent ({ commit }, object) {
			const { data } = await BACKEND.post('/s', object)
			return data.shortcode
		},
		async downloadSharedAgent ({ commit }, shortcode) {
			const { data } = await BACKEND.get(`/s/${shortcode}`)
			return data
		}
	}
})
