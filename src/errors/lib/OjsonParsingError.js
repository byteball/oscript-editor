export default class OjsonParsingError extends Error {
	constructor (message) {
		super(message)
		Error.captureStackTrace(this, this.constructor)
	}
}
