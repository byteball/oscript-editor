export default class InternalError extends Error {
	constructor (message) {
		super(message)

		if (Error.captureStackTrace) {
			Error.captureStackTrace(this, this.constructor)
		}
	}
}
