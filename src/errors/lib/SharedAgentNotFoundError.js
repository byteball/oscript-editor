export default class SharedAgentNotFoundError extends Error {
	constructor (message) {
		super(message)

		if (Error.captureStackTrace) {
			Error.captureStackTrace(this, this.constructor)
		}
	}
}
