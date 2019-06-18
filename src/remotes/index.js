import axios from 'axios'

/* eslint-disable-next-line no-undef */
const config = __APP_CONFIG__

const BACKEND = axios.create({
	baseURL: config.api.url,
	timeout: 5000
})

export {
	BACKEND
}
