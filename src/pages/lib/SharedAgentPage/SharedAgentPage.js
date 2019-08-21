import { mapActions } from 'vuex'

export default {
	props: {
		shortcode: String
	},
	async created () {
		const agent = await this.myjsonDownload(this.shortcode)
		const label = agent.label.match(/\(shared\) \d+$/) ? agent.label : agent.label + ' (shared)'
		await this.createNewAgent({ text: agent.text, label })
		this.$router.push({ path: '/' })
	},
	methods: {
		...mapActions({
			myjsonDownload: 'myjsonApi/download',
			createNewAgent: 'agents/createNewAgent'
		})
	}
}
