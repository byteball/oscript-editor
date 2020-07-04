import { SharedAgentNotFoundError } from 'src/errors'
import { mapActions } from 'vuex'

export default {
	props: {
		shortcode: String
	},
	data () {
		return {
			isSharedAgentNotFound: false
		}
	},
	async created () {
		try {
			const agent = await this.downloadSharedAgent(this.shortcode)
			const existingAgent = await this.getExistingSharedAgent(agent.text)
			if (existingAgent) {
				await this.changeSelectedAgent(existingAgent.id)
			} else {
				await this.addSharedAgent({ text: agent.text, label: agent.label, shortcode: this.shortcode })
			}
			this.$router.push({ path: '/' })
		} catch (e) {
			if (e instanceof SharedAgentNotFoundError) {
				this.isSharedAgentNotFound = true
			} else {
				this.$router.push({ path: '/' })
			}
		}
	},
	methods: {
		...mapActions({
			downloadSharedAgent: 'backend/downloadSharedAgent',
			addSharedAgent: 'agents/addSharedAgent',
			changeSelectedAgent: 'agents/changeSelected',
			getExistingSharedAgent: 'agents/getExistingSharedAgent'
		})
	}
}
