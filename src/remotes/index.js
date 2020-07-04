import axios from 'axios'
import get from 'lodash/get'
import {
	ErrorCodes,
	ParsingError,
	InternalError,
	ValidationError,
	SharedAgentNotFoundError,
	AgentAlreadyDeployedError
} from 'src/errors'

/* eslint-disable-next-line no-undef */
const config = __APP_CONFIG__

const BACKEND = axios.create({
	baseURL: config.api.url,
	timeout: 5000
})

BACKEND.interceptors.response.use(
	(response) => {
		return response
	},
	(error) => {
		const { response } = error
		if (response) {
			if (response && response.status === 400) {
				switch (get(response, 'data.errorCode', '')) {
				case ErrorCodes.VALIDATION_ERROR:
					throw new ValidationError(response.data.error)
				case ErrorCodes.PARSING_ERROR:
					throw new ParsingError(response.data.error)
				case ErrorCodes.SHARED_AGENT_NOT_FOUND_ERROR:
					throw new SharedAgentNotFoundError(response.data.error)
				}
			} else if (response && response.status === 500) {
				switch (response.status) {
				case ErrorCodes.AGENT_ALREADY_DEPLOYED_ERROR:
					throw new AgentAlreadyDeployedError(response.data.error)
				case ErrorCodes.INTERNAL_ERROR:
					throw new InternalError(response.data.error)
				}
			}
			throw new Error(get(response, 'data.error', 'Unexpected Error'))
		} else {
			throw new Error('Network Error')
		}
	}
)
export {
	BACKEND
}
