import MonacoEditor from 'vue-monaco'
import monacoLanguages from 'src/languages'

const oscript = monacoLanguages['oscript']

export default {
  components: {
    MonacoEditor
  },
  data () {
    return {
      language: oscript.id,
      code: oscript.codeStub
    }
  },
  methods: {
    deploy () {
      console.log('Deploy AA')
    }
  }
}
