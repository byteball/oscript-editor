export default class InternalError extends Error {
	constructor (message) {
		super(message)
		Error.captureStackTrace(this, this.constructor)
	}
}
