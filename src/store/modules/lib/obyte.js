import obyte from 'obyte'
import objectHash from 'ocore/object_hash'
import constants from 'ocore/constants'

export default () => ({
	namespaced: true,
	actions: {
		async isAgentDuplicate ({ commit }, ojson) {
			return new Promise((resolve, reject) => {
				const address = objectHash.getChash160(JSON.parse(ojson))
				const client = new obyte.Client(
					constants.bTestnet ? 'wss://obyte.org/bb-test' : 'wss://obyte.org/bb',
					{ testnet: constants.bTestnet }
				)

				client.api.getDefinition(address, function (err, result) {
					client.close()
					if (err) {
						resolve({
							isDuplicate: false,
							error: err
						})
					} else if (result) {
						resolve({
							isDuplicate: true,
							error: `Agent already deployed with address ${address}`
						})
					} else {
						resolve({ isDuplicate: false })
					}
				})
			})
		}
	}
})
