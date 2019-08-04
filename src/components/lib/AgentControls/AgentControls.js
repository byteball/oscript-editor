export default {
	props: {
		selectedLabel: String,
		isSelectedAgentUser: Boolean
	},
	data () {
		return {
			renameInput: '',
			isRenamingActive: false,
			isDeletingActive: false
		}
	},
	methods: {
		async handleActionNew () {
			this.$emit('new')
		},
		async handleActionShare () {
			this.$emit('share')
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
			this.renameInput = this.selectedLabel
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
		}
	}
}
