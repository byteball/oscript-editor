import Vue from 'vue'
import Router from 'vue-router'
import { EditorPage } from 'src/pages'

Vue.use(Router)

export default new Router({
	mode: 'history',
	base: process.env.BASE_URL,
	routes: [
		{
			path: '/',
			name: 'home',
			component: EditorPage
		},
		{
			path: '/s/:id',
			name: 'savedhome',
			component: EditorPage
		}
	]
})
