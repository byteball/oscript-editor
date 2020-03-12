import QRCode from 'qrcode'
import constants from 'ocore/constants'

/* eslint-disable-next-line no-undef */
const config = __APP_CONFIG__
const EXPIRATION_TIMEOUT = config.agentLinkExpirationTimeout

export default {
	props: {
		shortcode: String
	},
	data () {
		return {
			qr: '',
			expirationTimeout: EXPIRATION_TIMEOUT
		}
	},
	computed: {
		deploymentUri () {
			return `${constants.bTestnet ? 'obyte-tn' : 'obyte'}:data?app=definition&definition=${config.api.url}link/${this.shortcode}`
		}
	},
	async created () {
		try {
			this.qr = await QRCode.toDataURL(this.deploymentUri)
		} catch (e) {
			// eslint-disable-next-line no-console
			console.log('Can not generate QR code', e)
		}
	}
}
