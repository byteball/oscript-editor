import VueCountdown from '@chenfengyuan/vue-countdown'
import QRCode from 'qrcode'

/* eslint-disable-next-line no-undef */
const config = __APP_CONFIG__
const EXPIRATION_TIMEOUT = config.agentLinkExpirationTimeout
export default {
	components: {
		VueCountdown
	},
	props: {
		sourceString: String
	},
	data () {
		return {
			qr: '',
			timeoutId: null,
			expirationTimeout: EXPIRATION_TIMEOUT
		}
	},
	watch: {
		async sourceString (newString) {
			if (this.timeoutId) {
				clearTimeout(this.timeoutId)
				this.timeoutId = null
			}
			if (!newString) {
				this.qr = ''
			} else {
				try {
					this.qr = await QRCode.toDataURL(newString)
					this.timeoutId = setTimeout(this.handleCloseClick, EXPIRATION_TIMEOUT)
				} catch (e) {
					// eslint-disable-next-line no-console
					console.log('Can not generate QR code', e)
				}
			}
		}
	},
	methods: {
		handleCloseClick () {
			if (this.timeoutId) {
				clearTimeout(this.timeoutId)
				this.timeoutId = null
			}
			this.qr = ''
			this.$emit('closed')
		}
	}
}
