@{%

const moo = require('moo')

let lexer = moo.states({
	main: {
		space: {match: /\s+/, lineBreaks: true},
		comment: /\/\/.*$/,
		blockComment: { match: /\/\*[^]*?\*\//, lineBreaks: true },
		messages: ['"messages"', 'messages', '`messages`', "'messages'"],
		init: ['"init"', 'init', '`init`', "'init'"],
		bounce_fees: ['"bounce_fees"', 'bounce_fees', '`bounce_fees`', "'bounce_fees'"],
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
		ifWord: ['"if"', 'if', '`if`', "'if'"],
		null: 'null',
		base: ['"base"', 'base', '`base`', "'base'"],
		cases: ['"cases"', 'cases', '`cases`', "'cases'"],
		app: {match: ['"app":', 'app:', '`app`:', "'app':"], push: 'appList'},
		state: ['"state"', 'state', '`state`', "'state'"],
		payloadFormula: [/payload:\s+(?![{\[])/, /"payload":\s+(?![{\[])/, /`payload`:\s+(?![{\[])/, /'payload':\s+(?![{\[])/],
		payload: { match: [/payload:\s+{/, /"payload":\s+{/, /'payload':\s+{/, /`payload`:\s+{/], push: 'payload'},
		payloadArray: { match: [/payload:\s+\[/, /"payload":\s+\[/, /'payload':\s+\[/, /`payload`:\s+\[/], push: 'payload'},
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
		blockComment: { match: /\/\*[^]*?\*\//, lineBreaks: true },
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
		comment: /\/\/.*$/,
		blockComment: { match: /\/\*[^]*?\*\//, lineBreaks: true },
		formulaDoubleStart: { match: '"{', push: 'formulaDouble' },
		formulaSingleStart: { match: "'{", push: 'formulaSingle' },
		formulaBackStart: { match: '`{', push: 'formulaBack' },
		"{": {match: "{", push: "payload"},
		"}": {match: "}", pop: 1},
		'[': '[',
		']': ']',
		':': ':',
		',': ',',
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

const assetPair = (d) => {
	let asset = d[0][0].text
	if (asset.match(/base/) || asset.match(/'base'/) || asset.match(/"base"/) || asset.match(/`base`/)) {
		asset = 'base'
	}

	return {
		type: TYPES.BOUNCE_ASSET,
		asset: asset,
		value: d[3],
		context: c(d[0][0])
	}
}

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
	return array
}

const quoted = (d) => d[1][0]

const log = cb => {
	return (d) => {
		console.log('d', d)
		return cb(d)
	}
}

%}

@lexer lexer

quoted[X] ->
		"'" $X "'" 		{% quoted %}
	| "`" $X "`" 		{% quoted %}
	| "\"" $X "\"" 	{% quoted %}

commaOptional[X] ->
		$X ",":?							{% commaOptionalSingle %}
	| $X ("," _ $X):+ ",":?	{% commaOptionalMany %}

start -> main {% (d) => d[0] %}
	| mainWithAA {% (d) => d[0] %}

mainWithAA -> _ "[" _ quoted[%autonomous_agent] "," main "]" _ {% (d) => d[5] %}

main ->	_ "{" _ mainBlock _ "}" _ {% main %}

mainBlock -> commaOptional[(init | bounce_fees | messages )] {% mainBlock %}

init -> %init ":" _ formula {% init %}
bounce_fees -> %bounce_fees ":" _ bounce_asset {% bounceFees %}

bounce_asset -> "{" _ commaOptional[assetPair] _ "}" {% bounceAsset %}

assetPair -> (%base | %base64) ":" _ int {% assetPair %}

messages ->
		%messages ":" _ "[" _ commaOptional[message] _ "]"	{% messagesArray %}
	| %messages ":" _ "{" _ commaOptional[cases] _ "}"		{% messagesCases %}

cases -> %cases ":" _ "[" _ commaOptional[case] _ "]" {% cases %}
case -> "{" _ commaOptional[(messages | if | init)] _ "}" {% caseP %}

message -> "{" _ commaOptional[(app | payloadFormula | payload | if | state | payloadArray | init)] _ "}" {% message %}

if -> %ifWord ":" _ formula {% ifWord %}
app -> %app _ quoted[appList] {% app %}
appList -> %appList {% (d) => d[0].text %}

state -> %state ":" _ formula {% state %}
payload -> %payload _ commaOptional[pair] _ "}" {% payload %}
payloadArray -> %payloadArray _ arrayContent _ "]" {% payloadArray %}
payloadFormula -> %payloadFormula _ formula {% payloadFormula %}

object -> "{" _ commaOptional[pair] _ "}" {% objectP %}

pair -> key ":" _ value {% pair %}

key ->
		str 				{% (d) => d[0] %}
	| quoted[str]	{% (d) => d[0] %}
	| formula			{% (d) => d[0] %}
	| base64			{% (d) => d[0] %}

value ->
		formula
	| true
	| false
	| array
	| object
	| quoted[str]
	| base64
	| decimal
	| quoted[decimal] {% valueDecimal %}

array -> "[" _ arrayContent _ "]" {% array %}
arrayContent -> commaOptional[(object | formula | quoted[str] | base64 | array)] {% arrayContent %}

formula ->
		%formulaDoubleStart %formula:? %formulaDoubleEnd {% formula %}
	|	%formulaSingleStart %formula:? %formulaSingleEnd {% formula %}
	|	%formulaBackStart %formula:? %formulaBackEnd		 {% formula %}

_ -> null
	| %space (%comment _):? {% (d) => null %}
	| %comment _ {% (d) => null %}
	| _ %blockComment _ {% (d) => null %}

int -> %int {% int %}
str -> %str {% str %}
true -> %true {% trueP %}
base64 -> %base64 {% base64ToStr %}
false -> %false {% falseP %}
decimal -> %decimal {% decimal %}
