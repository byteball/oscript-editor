<template src="./App.htm"></template>
<script src="./App.js"></script>
<style lang="scss" src="./App.scss"></style>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<style lang="scss">
@import 'src/styles/variables';
.multiselect {
	width: fit-content;
}
.multiselect__input::placeholder {
	font-style: italic;
}
.multiselect__single {
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}
.multiselect__option--highlight {
	background-color: $color-primary;
	&.multiselect__option--selected {
		background-color: $color-primary;
	}
}
</style>
