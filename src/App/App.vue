<template src="./App.htm"></template>
<script src="./App.js"></script>
<style lang="scss" src="./App.scss"></style>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<style lang="scss">
@import 'src/styles/mixins';
@import 'src/styles/variables';

$multiselect-height: 24px;
$multiselect-fontsize: 14px;

.select-agent {
	.multiselect__option {
		padding: 0 20px!important;
		min-height: $multiselect-height;
		&.multiselect__option--group {
			padding-left: 12px!important;
		}
	}
	.multiselect-no-results {
		position: relative;
		font-size: $multiselect-fontsize;
		left: -8px;
		padding: 0;
		padding-top: 4px;
	}
}

.multiselect {
	cursor: pointer;
	width: fit-content;
	min-height: $multiselect-height;
	height: $multiselect-height;
	.multiselect__select {
		padding-top: 2px;
		padding-bottom: 2px;
		min-height: $multiselect-height;
		height: $multiselect-height;
	}
	.multiselect__tags {
		padding-top: 1px;
		min-height: $multiselect-height;
		height: $multiselect-height;
	}
	.multiselect__single {
		font-size: $multiselect-fontsize;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.multiselect__input::placeholder {
		font-size: $multiselect-fontsize;
	}
	.multiselect__content {
		.multiselect__element {
			font-size: $multiselect-fontsize;
			height: $multiselect-height;
			min-height: $multiselect-height;
			.multiselect__option {
				@include flex(row, flex-start, center);
				padding: 0 12px;
				height: $multiselect-height;
				min-height: $multiselect-height;
				&.multiselect__option--group {
					background-color: white!important;
					font-weight: bold;
					padding-left: 12px;
				}
				&.multiselect__option--disabled {
					background-color: white!important;
					color: $color-primary!important;
				}
				&.multiselect__option--highlight {
					background-color: $color-primary;
					font-weight: normal;
					&.multiselect__option--selected {
						font-weight: normal;
						background-color: $color-primary;
					}
				}
				&.multiselect__option--selected {
					font-weight: normal;
					background-color: #e8e8e8;
				}
			}
		}
	}
}
</style>
