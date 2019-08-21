import Vue from 'vue'
import Router from 'vue-router'
import { EditorPage, SharedAgentPage } from 'src/pages'

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
			path: '/s/:shortcode',
			name: 'shared',
			props: true,
			component: SharedAgentPage
		}
	]
})
