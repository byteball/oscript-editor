import QRCode from 'qrcode'
import constants from 'ocore/constants'
import VueCountdown from '@chenfengyuan/vue-countdown'
import { mapActions } from 'vuex'

/* eslint-disable-next-line no-undef */
const config = __APP_CONFIG__
const EXPIRATION_TIMEOUT = config.agentLinkExpirationTimeout

export default {
	components: {
		VueCountdown
	},
	props: {
		shortcode: String
	},
	data () {
		return {
			qr: '',
			invalidLink: false,
			expiredLink: false,
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
			await this.getAgent(this.shortcode)
		} catch (e) {
			this.invalidLink = true
			return
		}
		try {
			this.qr = await QRCode.toDataURL(this.deploymentUri)
		} catch (e) {
			// eslint-disable-next-line no-console
			console.log('Can not generate QR code', e)
		}
	},
	methods: {
		...mapActions({
			getAgent: 'backend/getAgent'
		}),
		countdownDone () {
			this.expiredLink = true
		}
	}
}
