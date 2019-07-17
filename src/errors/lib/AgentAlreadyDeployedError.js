export default class AgentAlreadyDeployedError extends Error {
	constructor (message) {
		super(message)
		Error.captureStackTrace(this, this.constructor)
	}
}
