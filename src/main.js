import Vue from 'vue'
import Clipboard from 'v-clipboard'
import * as monaco from 'monaco-editor'
import monacoLanguages from 'src/languages'
import App from './App/App.vue'
import router from './router'
import store from './store'

Vue.use(Clipboard)

Object.keys(monacoLanguages).forEach(l => {
	const language = monacoLanguages[l]
	monaco.languages.register({
		id: language.id
	})
	monaco.languages.setMonarchTokensProvider(language.id, language.tokensProvider)
	if (language.conf) {
		monaco.languages.setLanguageConfiguration(language.id, language.conf)
	}
	if (language.suggestions) {
		monaco.languages.registerCompletionItemProvider(language.id, {
			provideCompletionItems: (model, position) => {
				return { suggestions: language.suggestions(model, position) }
			}
		})
	}
	if (language.hovers) {
		monaco.languages.registerHoverProvider(language.id, {
			provideHover: (model, position) => {
				return language.hovers(model, position)
			}
		})
	}
})

monaco.editor.defineTheme('dark', {
	base: 'vs-dark',
	inherit: true,
	rules: [
		{ token: 'variable', foreground: '00d0b3' },
		{ token: 'keyword.ojson', foreground: 'ffc966' },
		{ token: 'autocomplete', foreground: 'CE9178' }
	]
})

monaco.editor.defineTheme('white', {
	base: 'vs',
	inherit: true,
	rules: [
		{ token: 'variable', foreground: '00d0b3' },
		{ token: 'keyword.ojson', foreground: 'c28800' },
		{ token: 'autocomplete', foreground: 'A31515' }
	]
})

Vue.config.productionTip = false

new Vue({
	router,
	store,
	render: h => h(App)
}).$mount('#app')
