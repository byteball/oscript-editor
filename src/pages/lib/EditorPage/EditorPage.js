import MonacoEditor from 'vue-monaco'
import monacoLanguages from 'src/languages'

const ojson = monacoLanguages['ojson']

export default {
	components: {
		MonacoEditor
	},
	data () {
		return {
			theme: 'dark',
			language: ojson.id,
			code: ojson.codeStub
		}
	},
	methods: {
		deploy () {
			console.log('Deploy AA')
		}
	}
}
