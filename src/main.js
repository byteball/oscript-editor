import Vue from 'vue'
import * as monaco from 'monaco-editor'
import monacoLanguages from 'src/languages'
import App from './App/App.vue'
import router from './router'
import store from './store'

Object.keys(monacoLanguages).forEach(l => {
	const language = monacoLanguages[l]
	monaco.languages.register({
		id: language.id
	})
	monaco.languages.setMonarchTokensProvider(language.id, language.tokensProvider)
})

monaco.editor.defineTheme('obyte-dark', {
	base: 'vs-dark',
	inherit: true,
	rules: [
		{ token: 'variable', foreground: '00d0b3' }
	]
})

Vue.config.productionTip = false

new Vue({
	router,
	store,
	render: h => h(App)
}).$mount('#app')
