// Generated automatically by nearley, version 2.16.0
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }


const moo = require('moo')

let lexer = moo.states({
	main: {
		space: {match: /\s+/, lineBreaks: true},
		messages: 'messages',
		init: 'init',
		bounce_fees: 'bounce_fees',
		formulaDoubleStart: { match: '"{', push: 'formulaDouble' },
		formulaSingleStart: { match: "'{", push: 'formulaSingle' },
		formulaBackStart: { match: '`{', push: 'formulaBack' },
		'{': '{',
		'}': '}',
		'[': '[',
		']': ']',
		':': ':',
		',': ',',
		autonomous_agent: 'autonomous agent',
		comment: /\/\/.*$/,
		ifWord: 'if',
		null: 'null',
		base: 'base',
		cases: 'cases',
		app: {match: 'app:', push: 'appList'},
		state: 'state',
		payloadFormula: /payload:\s+(?![{\[])/,
		payload: { match: /payload:\s+{/, push: 'payload'},
		payloadArray: { match: /payload:\s+\[/, push: 'payload'},
		base64: [
			/'(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})'/,
			/"(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})"/,
			/`(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})`/,
		],
		'"': '"',
		"'": "'",
		'`': '`',
		int: /[0-9]+/,
	},
	appList: {
		space: {match: /\s+/, lineBreaks: true},
		comment: /\/\/.*$/,
		'"': '"',
		"'": "'",
		'`': '`',
		appList: {
			match: ['payment', 'data', 'data_feed', 'profile',
							'text', 'definition', 'asset_attestors',
							'attestation', 'state', 'definition_template',
							'poll', 'vote', 'asset'],
			pop: 1,
		}
	},
	payload: {
		space: {match: /\s+/, lineBreaks: true},
		formulaDoubleStart: { match: '"{', push: 'formulaDouble' },
		formulaSingleStart: { match: "'{", push: 'formulaSingle' },
		formulaBackStart: { match: '`{', push: 'formulaBack' },
		"{": {match: "{", push: "payload"},
		"}": {match: "}", pop: 1},
		'[': '[',
		']': ']',
		':': ':',
		',': ',',
		comment: /\/\/.*$/,
		true: 'true',
		false: 'false',
		base64: [
			/'(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})'/,
			/"(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})"/,
			/`(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})`/,
		],
		'"': '"',
		"'": "'",
		'`': '`',
		// [+-]?([0-9]*[.])?[0-9]+
		decimal: /(?:[+-])?(?:[0-9]*[.])?[0-9]+/,
		str: /[a-zA-Z_0-9 =+*/@-]+/,
	},
	formulaDouble: {
		formulaDoubleEnd: { match: '}"', pop: 1 },
		formula: {match: /[\s\S]+?(?=}")/, lineBreaks: true},
	},
	formulaSingle: {
		formulaSingleEnd: { match: "}'", pop: 1 },
		formula: {match: /[\s\S]+?(?=}')/, lineBreaks: true},
	},
	formulaBack: {
		formulaBackEnd: { match: '}`', pop: 1 },
		formula: {match: /[\s\S]+?(?=}`)/, lineBreaks: true},
	},
	})

const TYPES = {
	IF: 'IF',
	INT: 'INT',
	STR: 'STR',
	APP: 'APP',
	MAIN: 'MAIN',
	INIT: 'INIT',
	PAIR: 'PAIR',
	TRUE: 'TRUE',
	CASE: 'CASE',
	CASES: 'CASES',
	FALSE: 'FALSE',
	STATE: 'STATE',
	ARRAY: 'ARRAY',
	OBJECT: 'OBJECT',
	DECIMAL: 'DECIMAL',
	FORMULA: 'FORMULA',
	PAYLOAD: 'PAYLOAD',
	MESSAGE: 'MESSAGE',
	MESSAGES: 'MESSAGES',
	BOUNCE_FEES: 'BOUNCE_FEES',
	BOUNCE_ASSET: 'BOUNCE_ASSET',
}

const c = (token) => ({
	col: token.col,
	line: token.line,
	offset: token.offset,
	lineBreaks: token.lineBreaks,
})

const mainBlock = (d) => d[0].map(e => e[0])

const main = (d) => ({
	type: TYPES.MAIN,
	value: d[3],
	context: c(d[1])
})

const formula = (d) => ({
	type: TYPES.FORMULA,
	value: d[1] ? d[1].text : '',
	context: d[1] ? c(d[1]) : c(d[0])
})

const init = (d) => ({
	type: TYPES.INIT,
	value: d[3],
	context: c(d[0])
})

const bounceFees = (d) => ({
	type: TYPES.BOUNCE_FEES,
	value: d[3],
	context: c(d[0])
})

const bounceAsset = (d) => d[2]

const assetPair = (d) => ({
	type: TYPES.BOUNCE_ASSET,
	asset: d[0][0].text,
	value: d[3],
	context: c(d[0][0])
})

const messagesArray = (d) => ({
	type: TYPES.MESSAGES,
	value: {
		type: TYPES.ARRAY,
		value: d[5],
		context: c(d[3])
	},
	context: c(d[0])
})

const messagesCases = (d) => ({
	type: TYPES.MESSAGES,
	value: d[5][0],
	context: c(d[0])
})

const cases = (d) => ({
	type: TYPES.CASES,
	value: d[5],
	context: c(d[3])
})

const caseP = (d) => ({
	type: TYPES.CASE,
	value: d[2].map(e => e[0]),
	context: c(d[0])
})

const message = (d) => ({
	type: TYPES.MESSAGE,
	value: d[2].map(e => e[0]),
	context: c(d[0])
})

const ifWord = (d) => ({
	type: TYPES.IF,
	value: d[3],
	context: c(d[0])
})

const state = (d) => ({
	type: TYPES.STATE,
	value: d[3],
	context: c(d[0])
})

const app = (d) => ({
	type: TYPES.APP,
	value: d[2],
	context: c(d[0])
})

const payloadFormula = (d) => ({
	type: TYPES.PAYLOAD,
	value: d[2],
	context: c(d[0])

})
const payload = (d) => ({
	type: TYPES.PAYLOAD,
	value: {
		type: TYPES.OBJECT,
		value: d[2],
		context: c(d[0])
	},
	context: c(d[0])
})

const payloadArray = (d) => ({
	type: TYPES.PAYLOAD,
	value: {
		type: TYPES.ARRAY,
		value: d[2],
		context: c(d[0])
	},
	context: c(d[0])
})

const pair = (d) => ({
	type: TYPES.PAIR,
	key: d[0],
	value: d[3][0],
	context: c(d[1])
})

const objectP = (d) => ({
	type: TYPES.OBJECT,
	value: d[2],
	context: c(d[0])
})

const array = (d) => ({
	type: TYPES.ARRAY,
	value: d[2],
	context: c(d[0])
})

const arrayContent = (d) => d[0].map(e => e[0])

const int = (d) => ({
	type: TYPES.INT,
	value: parseInt(d[0].text),
	context: c(d[0])
})

const decimal = (d) => ({
	type: TYPES.DECIMAL,
	value: parseFloat(d[0].text),
	context: c(d[0])
})

const valueDecimal = (d) => ([{
	type: TYPES.STR,
	value: '' + d[0].value,
	context: d[0].context
}])

const str = (d) => ({
	type: TYPES.STR,
	value: d[0].text,
	context: c(d[0])
})

const base64ToStr = (d) => ({
	type: TYPES.STR,
	value: d[0].text.slice(1, -1),
	context: c(d[0])
})

const trueP = (d) => ({
	type: TYPES.TRUE,
	value: true,
	context: c(d[0])
})

const falseP = (d) => ({
	type: TYPES.FALSE,
	value: false,
	context: c(d[0])
})

const commaOptionalSingle = (d) => d[0]
const commaOptionalMany = (d) => {
	let array = d[1].map(e => e[2][0])
	array.unshift(d[0][0])
	array.map(e => e[0])
	return array
}

const quoted = (d) => d[1][0]

const log = cb => {
	return (d) => {
		console.log('d', d)
		return cb(d)
	}
}

var grammar = {
    Lexer: lexer,
    ParserRules: [
    {"name": "start", "symbols": ["main"], "postprocess": (d) => d[0]},
    {"name": "start", "symbols": ["mainWithAA"], "postprocess": (d) => d[0]},
    {"name": "mainWithAA$macrocall$2", "symbols": [(lexer.has("autonomous_agent") ? {type: "autonomous_agent"} : autonomous_agent)]},
    {"name": "mainWithAA$macrocall$1", "symbols": [{"literal":"'"}, "mainWithAA$macrocall$2", {"literal":"'"}], "postprocess": quoted},
    {"name": "mainWithAA$macrocall$1", "symbols": [{"literal":"`"}, "mainWithAA$macrocall$2", {"literal":"`"}], "postprocess": quoted},
    {"name": "mainWithAA$macrocall$1", "symbols": [{"literal":"\""}, "mainWithAA$macrocall$2", {"literal":"\""}], "postprocess": quoted},
    {"name": "mainWithAA", "symbols": ["_", {"literal":"["}, "_", "mainWithAA$macrocall$1", {"literal":","}, "main", {"literal":"]"}, "_"], "postprocess": (d) => d[5]},
    {"name": "main", "symbols": ["_", {"literal":"{"}, "_", "mainBlock", "_", {"literal":"}"}, "_"], "postprocess": main},
    {"name": "mainBlock$macrocall$2$subexpression$1", "symbols": ["init"]},
    {"name": "mainBlock$macrocall$2$subexpression$1", "symbols": ["bounce_fees"]},
    {"name": "mainBlock$macrocall$2$subexpression$1", "symbols": ["messages"]},
    {"name": "mainBlock$macrocall$2", "symbols": ["mainBlock$macrocall$2$subexpression$1"]},
    {"name": "mainBlock$macrocall$1$ebnf$1", "symbols": [{"literal":","}], "postprocess": id},
    {"name": "mainBlock$macrocall$1$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "mainBlock$macrocall$1", "symbols": ["mainBlock$macrocall$2", "mainBlock$macrocall$1$ebnf$1"], "postprocess": commaOptionalSingle},
    {"name": "mainBlock$macrocall$1$ebnf$2$subexpression$1", "symbols": [{"literal":","}, "_", "mainBlock$macrocall$2"]},
    {"name": "mainBlock$macrocall$1$ebnf$2", "symbols": ["mainBlock$macrocall$1$ebnf$2$subexpression$1"]},
    {"name": "mainBlock$macrocall$1$ebnf$2$subexpression$2", "symbols": [{"literal":","}, "_", "mainBlock$macrocall$2"]},
    {"name": "mainBlock$macrocall$1$ebnf$2", "symbols": ["mainBlock$macrocall$1$ebnf$2", "mainBlock$macrocall$1$ebnf$2$subexpression$2"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "mainBlock$macrocall$1$ebnf$3", "symbols": [{"literal":","}], "postprocess": id},
    {"name": "mainBlock$macrocall$1$ebnf$3", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "mainBlock$macrocall$1", "symbols": ["mainBlock$macrocall$2", "mainBlock$macrocall$1$ebnf$2", "mainBlock$macrocall$1$ebnf$3"], "postprocess": commaOptionalMany},
    {"name": "mainBlock", "symbols": ["mainBlock$macrocall$1"], "postprocess": mainBlock},
    {"name": "init", "symbols": [(lexer.has("init") ? {type: "init"} : init), {"literal":":"}, "_", "formula"], "postprocess": init},
    {"name": "bounce_fees", "symbols": [(lexer.has("bounce_fees") ? {type: "bounce_fees"} : bounce_fees), {"literal":":"}, "_", "bounce_asset"], "postprocess": bounceFees},
    {"name": "bounce_asset$macrocall$2", "symbols": ["assetPair"]},
    {"name": "bounce_asset$macrocall$1$ebnf$1", "symbols": [{"literal":","}], "postprocess": id},
    {"name": "bounce_asset$macrocall$1$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "bounce_asset$macrocall$1", "symbols": ["bounce_asset$macrocall$2", "bounce_asset$macrocall$1$ebnf$1"], "postprocess": commaOptionalSingle},
    {"name": "bounce_asset$macrocall$1$ebnf$2$subexpression$1", "symbols": [{"literal":","}, "_", "bounce_asset$macrocall$2"]},
    {"name": "bounce_asset$macrocall$1$ebnf$2", "symbols": ["bounce_asset$macrocall$1$ebnf$2$subexpression$1"]},
    {"name": "bounce_asset$macrocall$1$ebnf$2$subexpression$2", "symbols": [{"literal":","}, "_", "bounce_asset$macrocall$2"]},
    {"name": "bounce_asset$macrocall$1$ebnf$2", "symbols": ["bounce_asset$macrocall$1$ebnf$2", "bounce_asset$macrocall$1$ebnf$2$subexpression$2"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "bounce_asset$macrocall$1$ebnf$3", "symbols": [{"literal":","}], "postprocess": id},
    {"name": "bounce_asset$macrocall$1$ebnf$3", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "bounce_asset$macrocall$1", "symbols": ["bounce_asset$macrocall$2", "bounce_asset$macrocall$1$ebnf$2", "bounce_asset$macrocall$1$ebnf$3"], "postprocess": commaOptionalMany},
    {"name": "bounce_asset", "symbols": [{"literal":"{"}, "_", "bounce_asset$macrocall$1", "_", {"literal":"}"}], "postprocess": bounceAsset},
    {"name": "assetPair$subexpression$1", "symbols": [(lexer.has("base") ? {type: "base"} : base)]},
    {"name": "assetPair$subexpression$1", "symbols": [(lexer.has("base64") ? {type: "base64"} : base64)]},
    {"name": "assetPair", "symbols": ["assetPair$subexpression$1", {"literal":":"}, "_", "int"], "postprocess": assetPair},
    {"name": "messages$macrocall$2", "symbols": ["message"]},
    {"name": "messages$macrocall$1$ebnf$1", "symbols": [{"literal":","}], "postprocess": id},
    {"name": "messages$macrocall$1$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "messages$macrocall$1", "symbols": ["messages$macrocall$2", "messages$macrocall$1$ebnf$1"], "postprocess": commaOptionalSingle},
    {"name": "messages$macrocall$1$ebnf$2$subexpression$1", "symbols": [{"literal":","}, "_", "messages$macrocall$2"]},
    {"name": "messages$macrocall$1$ebnf$2", "symbols": ["messages$macrocall$1$ebnf$2$subexpression$1"]},
    {"name": "messages$macrocall$1$ebnf$2$subexpression$2", "symbols": [{"literal":","}, "_", "messages$macrocall$2"]},
    {"name": "messages$macrocall$1$ebnf$2", "symbols": ["messages$macrocall$1$ebnf$2", "messages$macrocall$1$ebnf$2$subexpression$2"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "messages$macrocall$1$ebnf$3", "symbols": [{"literal":","}], "postprocess": id},
    {"name": "messages$macrocall$1$ebnf$3", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "messages$macrocall$1", "symbols": ["messages$macrocall$2", "messages$macrocall$1$ebnf$2", "messages$macrocall$1$ebnf$3"], "postprocess": commaOptionalMany},
    {"name": "messages", "symbols": [(lexer.has("messages") ? {type: "messages"} : messages), {"literal":":"}, "_", {"literal":"["}, "_", "messages$macrocall$1", "_", {"literal":"]"}], "postprocess": messagesArray},
    {"name": "messages$macrocall$4", "symbols": ["cases"]},
    {"name": "messages$macrocall$3$ebnf$1", "symbols": [{"literal":","}], "postprocess": id},
    {"name": "messages$macrocall$3$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "messages$macrocall$3", "symbols": ["messages$macrocall$4", "messages$macrocall$3$ebnf$1"], "postprocess": commaOptionalSingle},
    {"name": "messages$macrocall$3$ebnf$2$subexpression$1", "symbols": [{"literal":","}, "_", "messages$macrocall$4"]},
    {"name": "messages$macrocall$3$ebnf$2", "symbols": ["messages$macrocall$3$ebnf$2$subexpression$1"]},
    {"name": "messages$macrocall$3$ebnf$2$subexpression$2", "symbols": [{"literal":","}, "_", "messages$macrocall$4"]},
    {"name": "messages$macrocall$3$ebnf$2", "symbols": ["messages$macrocall$3$ebnf$2", "messages$macrocall$3$ebnf$2$subexpression$2"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "messages$macrocall$3$ebnf$3", "symbols": [{"literal":","}], "postprocess": id},
    {"name": "messages$macrocall$3$ebnf$3", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "messages$macrocall$3", "symbols": ["messages$macrocall$4", "messages$macrocall$3$ebnf$2", "messages$macrocall$3$ebnf$3"], "postprocess": commaOptionalMany},
    {"name": "messages", "symbols": [(lexer.has("messages") ? {type: "messages"} : messages), {"literal":":"}, "_", {"literal":"{"}, "_", "messages$macrocall$3", "_", {"literal":"}"}], "postprocess": messagesCases},
    {"name": "cases$macrocall$2", "symbols": ["case"]},
    {"name": "cases$macrocall$1$ebnf$1", "symbols": [{"literal":","}], "postprocess": id},
    {"name": "cases$macrocall$1$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "cases$macrocall$1", "symbols": ["cases$macrocall$2", "cases$macrocall$1$ebnf$1"], "postprocess": commaOptionalSingle},
    {"name": "cases$macrocall$1$ebnf$2$subexpression$1", "symbols": [{"literal":","}, "_", "cases$macrocall$2"]},
    {"name": "cases$macrocall$1$ebnf$2", "symbols": ["cases$macrocall$1$ebnf$2$subexpression$1"]},
    {"name": "cases$macrocall$1$ebnf$2$subexpression$2", "symbols": [{"literal":","}, "_", "cases$macrocall$2"]},
    {"name": "cases$macrocall$1$ebnf$2", "symbols": ["cases$macrocall$1$ebnf$2", "cases$macrocall$1$ebnf$2$subexpression$2"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "cases$macrocall$1$ebnf$3", "symbols": [{"literal":","}], "postprocess": id},
    {"name": "cases$macrocall$1$ebnf$3", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "cases$macrocall$1", "symbols": ["cases$macrocall$2", "cases$macrocall$1$ebnf$2", "cases$macrocall$1$ebnf$3"], "postprocess": commaOptionalMany},
    {"name": "cases", "symbols": [(lexer.has("cases") ? {type: "cases"} : cases), {"literal":":"}, "_", {"literal":"["}, "_", "cases$macrocall$1", "_", {"literal":"]"}], "postprocess": cases},
    {"name": "case$macrocall$2$subexpression$1", "symbols": ["messages"]},
    {"name": "case$macrocall$2$subexpression$1", "symbols": ["if"]},
    {"name": "case$macrocall$2$subexpression$1", "symbols": ["init"]},
    {"name": "case$macrocall$2", "symbols": ["case$macrocall$2$subexpression$1"]},
    {"name": "case$macrocall$1$ebnf$1", "symbols": [{"literal":","}], "postprocess": id},
    {"name": "case$macrocall$1$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "case$macrocall$1", "symbols": ["case$macrocall$2", "case$macrocall$1$ebnf$1"], "postprocess": commaOptionalSingle},
    {"name": "case$macrocall$1$ebnf$2$subexpression$1", "symbols": [{"literal":","}, "_", "case$macrocall$2"]},
    {"name": "case$macrocall$1$ebnf$2", "symbols": ["case$macrocall$1$ebnf$2$subexpression$1"]},
    {"name": "case$macrocall$1$ebnf$2$subexpression$2", "symbols": [{"literal":","}, "_", "case$macrocall$2"]},
    {"name": "case$macrocall$1$ebnf$2", "symbols": ["case$macrocall$1$ebnf$2", "case$macrocall$1$ebnf$2$subexpression$2"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "case$macrocall$1$ebnf$3", "symbols": [{"literal":","}], "postprocess": id},
    {"name": "case$macrocall$1$ebnf$3", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "case$macrocall$1", "symbols": ["case$macrocall$2", "case$macrocall$1$ebnf$2", "case$macrocall$1$ebnf$3"], "postprocess": commaOptionalMany},
    {"name": "case", "symbols": [{"literal":"{"}, "_", "case$macrocall$1", "_", {"literal":"}"}], "postprocess": caseP},
    {"name": "message$macrocall$2$subexpression$1", "symbols": ["app"]},
    {"name": "message$macrocall$2$subexpression$1", "symbols": ["payloadFormula"]},
    {"name": "message$macrocall$2$subexpression$1", "symbols": ["payload"]},
    {"name": "message$macrocall$2$subexpression$1", "symbols": ["if"]},
    {"name": "message$macrocall$2$subexpression$1", "symbols": ["state"]},
    {"name": "message$macrocall$2$subexpression$1", "symbols": ["payloadArray"]},
    {"name": "message$macrocall$2$subexpression$1", "symbols": ["init"]},
    {"name": "message$macrocall$2", "symbols": ["message$macrocall$2$subexpression$1"]},
    {"name": "message$macrocall$1$ebnf$1", "symbols": [{"literal":","}], "postprocess": id},
    {"name": "message$macrocall$1$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "message$macrocall$1", "symbols": ["message$macrocall$2", "message$macrocall$1$ebnf$1"], "postprocess": commaOptionalSingle},
    {"name": "message$macrocall$1$ebnf$2$subexpression$1", "symbols": [{"literal":","}, "_", "message$macrocall$2"]},
    {"name": "message$macrocall$1$ebnf$2", "symbols": ["message$macrocall$1$ebnf$2$subexpression$1"]},
    {"name": "message$macrocall$1$ebnf$2$subexpression$2", "symbols": [{"literal":","}, "_", "message$macrocall$2"]},
    {"name": "message$macrocall$1$ebnf$2", "symbols": ["message$macrocall$1$ebnf$2", "message$macrocall$1$ebnf$2$subexpression$2"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "message$macrocall$1$ebnf$3", "symbols": [{"literal":","}], "postprocess": id},
    {"name": "message$macrocall$1$ebnf$3", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "message$macrocall$1", "symbols": ["message$macrocall$2", "message$macrocall$1$ebnf$2", "message$macrocall$1$ebnf$3"], "postprocess": commaOptionalMany},
    {"name": "message", "symbols": [{"literal":"{"}, "_", "message$macrocall$1", "_", {"literal":"}"}], "postprocess": message},
    {"name": "if", "symbols": [(lexer.has("ifWord") ? {type: "ifWord"} : ifWord), {"literal":":"}, "_", "formula"], "postprocess": ifWord},
    {"name": "app$macrocall$2", "symbols": ["appList"]},
    {"name": "app$macrocall$1", "symbols": [{"literal":"'"}, "app$macrocall$2", {"literal":"'"}], "postprocess": quoted},
    {"name": "app$macrocall$1", "symbols": [{"literal":"`"}, "app$macrocall$2", {"literal":"`"}], "postprocess": quoted},
    {"name": "app$macrocall$1", "symbols": [{"literal":"\""}, "app$macrocall$2", {"literal":"\""}], "postprocess": quoted},
    {"name": "app", "symbols": [(lexer.has("app") ? {type: "app"} : app), "_", "app$macrocall$1"], "postprocess": app},
    {"name": "appList", "symbols": [(lexer.has("appList") ? {type: "appList"} : appList)], "postprocess": (d) => d[0].text},
    {"name": "state", "symbols": [(lexer.has("state") ? {type: "state"} : state), {"literal":":"}, "_", "formula"], "postprocess": state},
    {"name": "payload$macrocall$2", "symbols": ["pair"]},
    {"name": "payload$macrocall$1$ebnf$1", "symbols": [{"literal":","}], "postprocess": id},
    {"name": "payload$macrocall$1$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "payload$macrocall$1", "symbols": ["payload$macrocall$2", "payload$macrocall$1$ebnf$1"], "postprocess": commaOptionalSingle},
    {"name": "payload$macrocall$1$ebnf$2$subexpression$1", "symbols": [{"literal":","}, "_", "payload$macrocall$2"]},
    {"name": "payload$macrocall$1$ebnf$2", "symbols": ["payload$macrocall$1$ebnf$2$subexpression$1"]},
    {"name": "payload$macrocall$1$ebnf$2$subexpression$2", "symbols": [{"literal":","}, "_", "payload$macrocall$2"]},
    {"name": "payload$macrocall$1$ebnf$2", "symbols": ["payload$macrocall$1$ebnf$2", "payload$macrocall$1$ebnf$2$subexpression$2"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "payload$macrocall$1$ebnf$3", "symbols": [{"literal":","}], "postprocess": id},
    {"name": "payload$macrocall$1$ebnf$3", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "payload$macrocall$1", "symbols": ["payload$macrocall$2", "payload$macrocall$1$ebnf$2", "payload$macrocall$1$ebnf$3"], "postprocess": commaOptionalMany},
    {"name": "payload", "symbols": [(lexer.has("payload") ? {type: "payload"} : payload), "_", "payload$macrocall$1", "_", {"literal":"}"}], "postprocess": payload},
    {"name": "payloadArray", "symbols": [(lexer.has("payloadArray") ? {type: "payloadArray"} : payloadArray), "_", "arrayContent", "_", {"literal":"]"}], "postprocess": payloadArray},
    {"name": "payloadFormula", "symbols": [(lexer.has("payloadFormula") ? {type: "payloadFormula"} : payloadFormula), "_", "formula"], "postprocess": payloadFormula},
    {"name": "object$macrocall$2", "symbols": ["pair"]},
    {"name": "object$macrocall$1$ebnf$1", "symbols": [{"literal":","}], "postprocess": id},
    {"name": "object$macrocall$1$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "object$macrocall$1", "symbols": ["object$macrocall$2", "object$macrocall$1$ebnf$1"], "postprocess": commaOptionalSingle},
    {"name": "object$macrocall$1$ebnf$2$subexpression$1", "symbols": [{"literal":","}, "_", "object$macrocall$2"]},
    {"name": "object$macrocall$1$ebnf$2", "symbols": ["object$macrocall$1$ebnf$2$subexpression$1"]},
    {"name": "object$macrocall$1$ebnf$2$subexpression$2", "symbols": [{"literal":","}, "_", "object$macrocall$2"]},
    {"name": "object$macrocall$1$ebnf$2", "symbols": ["object$macrocall$1$ebnf$2", "object$macrocall$1$ebnf$2$subexpression$2"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "object$macrocall$1$ebnf$3", "symbols": [{"literal":","}], "postprocess": id},
    {"name": "object$macrocall$1$ebnf$3", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "object$macrocall$1", "symbols": ["object$macrocall$2", "object$macrocall$1$ebnf$2", "object$macrocall$1$ebnf$3"], "postprocess": commaOptionalMany},
    {"name": "object", "symbols": [{"literal":"{"}, "_", "object$macrocall$1", "_", {"literal":"}"}], "postprocess": objectP},
    {"name": "pair", "symbols": ["key", {"literal":":"}, "_", "value"], "postprocess": pair},
    {"name": "key", "symbols": ["str"], "postprocess": (d) => d[0]},
    {"name": "key$macrocall$2", "symbols": ["str"]},
    {"name": "key$macrocall$1", "symbols": [{"literal":"'"}, "key$macrocall$2", {"literal":"'"}], "postprocess": quoted},
    {"name": "key$macrocall$1", "symbols": [{"literal":"`"}, "key$macrocall$2", {"literal":"`"}], "postprocess": quoted},
    {"name": "key$macrocall$1", "symbols": [{"literal":"\""}, "key$macrocall$2", {"literal":"\""}], "postprocess": quoted},
    {"name": "key", "symbols": ["key$macrocall$1"], "postprocess": (d) => d[0]},
    {"name": "key", "symbols": ["formula"], "postprocess": (d) => d[0]},
    {"name": "key", "symbols": ["base64"], "postprocess": (d) => d[0]},
    {"name": "value", "symbols": ["formula"]},
    {"name": "value", "symbols": ["true"]},
    {"name": "value", "symbols": ["false"]},
    {"name": "value", "symbols": ["array"]},
    {"name": "value", "symbols": ["object"]},
    {"name": "value$macrocall$2", "symbols": ["str"]},
    {"name": "value$macrocall$1", "symbols": [{"literal":"'"}, "value$macrocall$2", {"literal":"'"}], "postprocess": quoted},
    {"name": "value$macrocall$1", "symbols": [{"literal":"`"}, "value$macrocall$2", {"literal":"`"}], "postprocess": quoted},
    {"name": "value$macrocall$1", "symbols": [{"literal":"\""}, "value$macrocall$2", {"literal":"\""}], "postprocess": quoted},
    {"name": "value", "symbols": ["value$macrocall$1"]},
    {"name": "value", "symbols": ["base64"]},
    {"name": "value", "symbols": ["decimal"]},
    {"name": "value$macrocall$4", "symbols": ["decimal"]},
    {"name": "value$macrocall$3", "symbols": [{"literal":"'"}, "value$macrocall$4", {"literal":"'"}], "postprocess": quoted},
    {"name": "value$macrocall$3", "symbols": [{"literal":"`"}, "value$macrocall$4", {"literal":"`"}], "postprocess": quoted},
    {"name": "value$macrocall$3", "symbols": [{"literal":"\""}, "value$macrocall$4", {"literal":"\""}], "postprocess": quoted},
    {"name": "value", "symbols": ["value$macrocall$3"], "postprocess": valueDecimal},
    {"name": "array", "symbols": [{"literal":"["}, "_", "arrayContent", "_", {"literal":"]"}], "postprocess": array},
    {"name": "arrayContent$macrocall$2$subexpression$1", "symbols": ["object"]},
    {"name": "arrayContent$macrocall$2$subexpression$1", "symbols": ["formula"]},
    {"name": "arrayContent$macrocall$2$subexpression$1$macrocall$2", "symbols": ["str"]},
    {"name": "arrayContent$macrocall$2$subexpression$1$macrocall$1", "symbols": [{"literal":"'"}, "arrayContent$macrocall$2$subexpression$1$macrocall$2", {"literal":"'"}], "postprocess": quoted},
    {"name": "arrayContent$macrocall$2$subexpression$1$macrocall$1", "symbols": [{"literal":"`"}, "arrayContent$macrocall$2$subexpression$1$macrocall$2", {"literal":"`"}], "postprocess": quoted},
    {"name": "arrayContent$macrocall$2$subexpression$1$macrocall$1", "symbols": [{"literal":"\""}, "arrayContent$macrocall$2$subexpression$1$macrocall$2", {"literal":"\""}], "postprocess": quoted},
    {"name": "arrayContent$macrocall$2$subexpression$1", "symbols": ["arrayContent$macrocall$2$subexpression$1$macrocall$1"]},
    {"name": "arrayContent$macrocall$2$subexpression$1", "symbols": ["base64"]},
    {"name": "arrayContent$macrocall$2$subexpression$1", "symbols": ["array"]},
    {"name": "arrayContent$macrocall$2", "symbols": ["arrayContent$macrocall$2$subexpression$1"]},
    {"name": "arrayContent$macrocall$1$ebnf$1", "symbols": [{"literal":","}], "postprocess": id},
    {"name": "arrayContent$macrocall$1$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "arrayContent$macrocall$1", "symbols": ["arrayContent$macrocall$2", "arrayContent$macrocall$1$ebnf$1"], "postprocess": commaOptionalSingle},
    {"name": "arrayContent$macrocall$1$ebnf$2$subexpression$1", "symbols": [{"literal":","}, "_", "arrayContent$macrocall$2"]},
    {"name": "arrayContent$macrocall$1$ebnf$2", "symbols": ["arrayContent$macrocall$1$ebnf$2$subexpression$1"]},
    {"name": "arrayContent$macrocall$1$ebnf$2$subexpression$2", "symbols": [{"literal":","}, "_", "arrayContent$macrocall$2"]},
    {"name": "arrayContent$macrocall$1$ebnf$2", "symbols": ["arrayContent$macrocall$1$ebnf$2", "arrayContent$macrocall$1$ebnf$2$subexpression$2"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "arrayContent$macrocall$1$ebnf$3", "symbols": [{"literal":","}], "postprocess": id},
    {"name": "arrayContent$macrocall$1$ebnf$3", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "arrayContent$macrocall$1", "symbols": ["arrayContent$macrocall$2", "arrayContent$macrocall$1$ebnf$2", "arrayContent$macrocall$1$ebnf$3"], "postprocess": commaOptionalMany},
    {"name": "arrayContent", "symbols": ["arrayContent$macrocall$1"], "postprocess": arrayContent},
    {"name": "formula$ebnf$1", "symbols": [(lexer.has("formula") ? {type: "formula"} : formula)], "postprocess": id},
    {"name": "formula$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "formula", "symbols": [(lexer.has("formulaDoubleStart") ? {type: "formulaDoubleStart"} : formulaDoubleStart), "formula$ebnf$1", (lexer.has("formulaDoubleEnd") ? {type: "formulaDoubleEnd"} : formulaDoubleEnd)], "postprocess": formula},
    {"name": "formula$ebnf$2", "symbols": [(lexer.has("formula") ? {type: "formula"} : formula)], "postprocess": id},
    {"name": "formula$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "formula", "symbols": [(lexer.has("formulaSingleStart") ? {type: "formulaSingleStart"} : formulaSingleStart), "formula$ebnf$2", (lexer.has("formulaSingleEnd") ? {type: "formulaSingleEnd"} : formulaSingleEnd)], "postprocess": formula},
    {"name": "formula$ebnf$3", "symbols": [(lexer.has("formula") ? {type: "formula"} : formula)], "postprocess": id},
    {"name": "formula$ebnf$3", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "formula", "symbols": [(lexer.has("formulaBackStart") ? {type: "formulaBackStart"} : formulaBackStart), "formula$ebnf$3", (lexer.has("formulaBackEnd") ? {type: "formulaBackEnd"} : formulaBackEnd)], "postprocess": formula},
    {"name": "_", "symbols": []},
    {"name": "_$ebnf$1$subexpression$1", "symbols": [(lexer.has("comment") ? {type: "comment"} : comment), "_"]},
    {"name": "_$ebnf$1", "symbols": ["_$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "_$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "_", "symbols": [(lexer.has("space") ? {type: "space"} : space), "_$ebnf$1"], "postprocess": (d) => null},
    {"name": "_", "symbols": [(lexer.has("comment") ? {type: "comment"} : comment), "_"], "postprocess": (d) => null},
    {"name": "int", "symbols": [(lexer.has("int") ? {type: "int"} : int)], "postprocess": int},
    {"name": "str", "symbols": [(lexer.has("str") ? {type: "str"} : str)], "postprocess": str},
    {"name": "true", "symbols": [(lexer.has("true") ? {type: "true"} : true)], "postprocess": trueP},
    {"name": "base64", "symbols": [(lexer.has("base64") ? {type: "base64"} : base64)], "postprocess": base64ToStr},
    {"name": "false", "symbols": [(lexer.has("false") ? {type: "false"} : false)], "postprocess": falseP},
    {"name": "decimal", "symbols": [(lexer.has("decimal") ? {type: "decimal"} : decimal)], "postprocess": decimal}
]
  , ParserStart: "start"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
