import { mapActions, mapGetters } from 'vuex'

export default {
	data () {
		return {
			sharedUri: '',
			renameInput: '',
			timeoutID: null,
			isSharingActive: false,
			isRenamingActive: false,
			isSharingFailed: false,
			isSharingSuccess: false,
			isDeletingActive: false
		}
	},
	computed: {
		...mapGetters({
			selectedAgent: 'agents/selectedAgent',
			isSelectedAgentUser: 'agents/isSelectedAgentUser',
			isSelectedAgentShared: 'agents/isSelectedAgentShared'
		})
	},
	methods: {
		...mapActions({
			myjsonUpload: 'myjsonApi/upload'
		}),
		async handleActionNew () {
			this.$emit('new')
		},
		async handleActionDelete () {
			this.isDeletingActive = true
		},
		async handleActionDeleteConfirm () {
			this.$emit('delete')
			this.isDeletingActive = false
		},
		async handleActionDeleteCancel () {
			this.isDeletingActive = false
		},
		async handleActionRename () {
			this.renameInput = this.selectedAgent.label
			this.isRenamingActive = true
			setTimeout(() => {
				this.$refs.renameInputEl.focus()
				this.$refs.renameInputEl.setSelectionRange(0, this.renameInput.length)
			}, 10)
		},
		async handleActionRenameDone () {
			this.$emit('rename', this.renameInput)
			this.isRenamingActive = false
		},
		async handleActionRenameCancel () {
			this.isRenamingActive = false
		},
		async handleMouseleave () {
			this.isDeletingActive = false
		},

		async handleActionShare () {
			this.isSharingActive = true
			try {
				const shortcode = this.isSelectedAgentShared
					? this.selectedAgent.shortcode
					: await this.myjsonUpload({ label: this.selectedAgent.label, text: this.selectedAgent.text })
				this.sharedUri = window.location.href + `s/${shortcode}`
				this.isSharingSuccess = true
				this.isSharingActive = false
				this.$clipboard(this.sharedUri)
				this.$emit('share', shortcode)

				this.timeoutID = setTimeout(() => {
					this.handleDismissSharingSuccess()
				}, 5000)
			} catch (error) {
				this.isSharingFailed = true
				this.timeoutID = setTimeout(() => {
					this.handleDismissSharingFailed()
				}, 5000)
			}
		},
		async handleDismissSharingFailed () {
			if (this.timeoutID) {
				window.clearTimeout(this.timeoutID)
			}
			this.resetSharingState()
		},
		async handleDismissSharingSuccess () {
			if (this.timeoutID) {
				window.clearTimeout(this.timeoutID)
			}
			this.resetSharingState()
		},
		resetSharingState () {
			this.sharedUri = ''
			this.timeoutID = null
			this.isSharingActive = false
			this.isSharingFailed = false
			this.isSharingSuccess = false
		}
	}
}
