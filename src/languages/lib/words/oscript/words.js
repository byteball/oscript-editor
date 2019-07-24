import * as monaco from 'monaco-editor'

export default [
	{
		label: 'false',
		insertText: 'false',
		kind: monaco.languages.CompletionItemKind.Keyword
	},
	{
		label: 'if',
		insertText: 'if',
		kind: monaco.languages.CompletionItemKind.Keyword
	},
	{
		label: 'return',
		insertText: 'return',
		kind: monaco.languages.CompletionItemKind.Keyword
	},
	{
		label: 'true',
		insertText: 'true',
		kind: monaco.languages.CompletionItemKind.Keyword
	},
	{
		label: 'var',
		insertText: 'var',
		kind: monaco.languages.CompletionItemKind.Keyword
	},
	{
		quoted: false,
		label: 'trigger.output',
		insertText: 'trigger.output',
		kind: monaco.languages.CompletionItemKind.Keyword,
		detail: '`trigger.output` external reference',
		documentation: {
			value:
`
	\`{
	trigger.output[[asset=assetName]].field
	trigger.output[[asset!=assetName]].field
	}\`

Output sent to the AA address in the specified asset.

\`assetName\` can be \`base\` for bytes or any expression that evaluates to asset ID.

\`field\` can be \`amount\` or \`asset\` or omitted.  If omitted, \`amount\` is assumed.  If the trigger unit had several outputs in the same asset to this AA address, their amounts are summed.

The search criteria can be \`=\` (\`asset=assetName\`) or \`!=\` (\`asset!=assetName\`).

Examples:

	\`{
	trigger.output[[asset=base]]
	trigger.output[[asset=base]].amount
	trigger.output[[asset="j52n7Bfec9jW"]]
	trigger.output[[asset=$asset]]
	trigger.output[[asset!=base]]
	trigger.output[[asset!=base]].amount
	if (trigger.output[[asset!=base]].asset == 'ambiguous'){
		...
	}
	}\`

If there is no output that satisfies the search criteria, the returned \`.amount\` is 0 and the returned \`.asset\` is a string \`none\`.  Your code should check for this string if necessary.

If there is more than one output that satisfies the search criteria (which is possible only for \`!=\`), the returned \`.asset\` is a string \`ambiguous\`.  Your code should check for this string if necessary.  Trying to access \`.amount\` of an ambiguous asset fails the script.
`
		}
	},
	{
		quoted: false,
		label: 'trigger.data',
		insertText: 'trigger.data',
		kind: monaco.languages.CompletionItemKind.Keyword,
		detail: '`trigger.data` external reference',
		documentation: {
			value:
`
Data sent with the trigger unit in its \`data\` message.  \`trigger.data\` returns the entire data object, \`trigger.data.field1.field2\` or \`trigger.data.field1[expr2]\` tries to access a deeper nested field:
* if it is an object, object is returned;
* if it is a scalar (string, number, or boolean), scalar is returned;
* if it doesn't exist, \`false\` is returned.

For example, if the trigger unit had this data message

	{
		"app": "data",
		"payload": {
			"field1": {
				"field2": "value2",
				"abc": 88
			},
			"abc": "def"
		},
		"payload_hash": "..."
	}

\`trigger.data\` would be equal to

	{
		"field1": {
			"field2": "value2",
			"abc": 88
		},
		"abc": "def"
	}

\`trigger.data.field1\` would be equal to

	{
		"field2": "value2",
		"abc": 88
	}

\`trigger.data.field1.field2\` would be equal to string \`value2\`,

\`trigger.data.field1['a' || 'bc']\` would be equal to number \`88\`,

\`trigger.data.field1.nonexistent\` would be equal to boolean \`false\`,

\`trigger.data.nonexistent.anotherfield\` would be equal to boolean \`false\`.
`
		}
	},
	{
		quoted: false,
		label: 'trigger.unit',
		insertText: 'trigger.unit',
		kind: monaco.languages.CompletionItemKind.Keyword,
		detail: '`trigger.unit` external reference',
		documentation: {
			value:
`
The unit that sent money to this AA.
`
		}
	},
	{
		quoted: false,
		label: 'trigger.address',
		insertText: 'trigger.address',
		kind: monaco.languages.CompletionItemKind.Keyword,
		detail: '`trigger.address` external reference',
		documentation: {
			value:
`
The address of the sender who sent money to this AA.  If the sending unit was signed by several addresses, the first one is used.
`
		}
	},
	{
		quoted: false,
		label: 'trigger.initial_address',
		insertText: 'trigger.initial_address',
		kind: monaco.languages.CompletionItemKind.Keyword,
		detail: '`trigger.initial_address` external reference',
		documentation: {
			value:
`
The address of the sender who sent money to the initial AA of a chain of AAs. Same as \`trigger.address\` if there was no chain.  When an AA sends money to another AA, \`trigger.initial_address\` remains unchanged.
`
		}
	},
	{
		quoted: false,
		label: 'mci',
		insertText: 'mci',
		kind: monaco.languages.CompletionItemKind.Keyword,
		detail: '`mci` external reference',
		documentation: {
			value:
`
MCI of the trigger unit, which is the same as MCI of MC unit the response unit (if any) will be attached to.
`
		}
	},
	{
		quoted: false,
		label: 'timestamp',
		insertText: 'timestamp',
		kind: monaco.languages.CompletionItemKind.Keyword,
		detail: '`timestamp` external reference',
		documentation: {
			value:
`
Timestamp of the MC unit that recently became stable, this is the unit whose stabilization triggered the execution of this AA.  This is the same unit the response unit (if any) will be attached to.
`
		}
	},
	{
		quoted: false,
		label: 'min_mci',
		insertText: 'min_mci',
		kind: monaco.languages.CompletionItemKind.Keyword,
		detail: '`min_mci` external reference',
		documentation: {
			value:
`
Hash of the MC unit that includes (or is equal to) the trigger unit.
`
		}
	},
	{
		quoted: false,
		label: 'this_address',
		insertText: 'this_address',
		kind: monaco.languages.CompletionItemKind.Keyword,
		detail: '`this_address` external reference',
		documentation: {
			value:
`
\`this_address\`, \`this address\`
The address of this AA.
`
		}
	},
	{
		quoted: false,
		label: 'response_unit',
		insertText: 'response_unit',
		kind: monaco.languages.CompletionItemKind.Keyword,
		detail: '`response_unit` external reference',
		documentation: {
			value:
`
The hash of the unit that will be generated by the AA in response to the trigger.  This variable is available only in state script.  Any references to this variable in any other scripts will fire an error.
`
		}
	},
	{
		quoted: false,
		label: 'mc_unit',
		insertText: 'mc_unit',
		kind: monaco.languages.CompletionItemKind.Keyword,
		detail: '`mc_unit` external reference',
		documentation: {
			value:
`
The hash of the MC unit that includes (or is equal to) the trigger unit.
`
		}
	},
	{
		quoted: false,
		label: 'asset',
		insertText: 'asset',
		kind: monaco.languages.CompletionItemKind.Keyword,
		detail: '`asset` external reference',
		documentation: {
			value:
`
	\`{
	asset[expr].field
	asset[expr].[field_expr]
	}\`

Extracts information about an asset. This adds +1 to complexity. \`expr\` is \`base\` for bytes or an expression that evaluates to an asset ID.

\`field\` is on of the following, \`field_expr\` should evaluate to one of the following:
* \`cap\`: number, total supply of the asset.  For uncapped assets, 0 is returned;
* \`is_private\`: boolean, is the asset private?
* \`is_transferrable\`: boolean, is the asset transferrable?
* \`auto_destroy\`: boolean, does the asset gets autodestroyed when sent to definer address?
* \`fixed_denominations\`: boolean,is the asset issued in fixed denominations?
* \`issued_by_definer_only\`: boolean, is the asset issued by definer only?
* \`cosigned_by_definer\`: boolean, should each transfer be cosigned by definer?
* \`spender_attested\`: boolean, should each holder be attested?
* \`is_issued\`: boolean, is any amount of the asset already issued?

Examples:

	\`{
	asset[base].cap
	asset["base"].cap
	asset["n9y3VomFeWFeZZ2PcSEcmyBb/bI7kzZduBJigNetnkY="].is_issued
	asset["n9y3VomFeWFeZZ2PcSEcmyBb/bI7kzZduBJigNetnkY="]['is_' || 'issued']
	}\`

If the asset does not exist, \`false\` is returned for any field.
`
		}
	},
	{
		quoted: false,
		label: 'data_feed',
		insertText: 'data_feed',
		kind: monaco.languages.CompletionItemKind.Keyword,
		detail: '`data_feed` external reference',
		documentation: {
			value:
`
	\`{
	data_feed[[oracles=listOfOracles, feed_name=nameOfDataFeed, ...]]
	}\`

Finds data feed value by search criteria.  This adds +1 to complexity.

There are multiple search criteria listed between the double brackets, their order is insignificant.
* \`oracles\`: string, list of oracle addresses delimited by \`:\` (usually only one oracle). \`this address\` is also a valid oracle address and it refers to the current AA;
* \`feed_name\`: string, the name of the data feed;
* \`feed_value\`: string or number, optional, search only for this specific value of the data feed;
* \`min_mci\`: number, optional, search only since the specified MCI;
* \`ifseveral\`: string, optional, \`last\` or \`abort\`, what to do if several values found that match all the search criteria, return the last one or abort the script with error, default is \`last\`
* \`ifnone\`: string or number or boolean, optional, the value to return if nothing is found.  By default, this results in an error and aborts the script;
* \`what\`: string, optional, \`value\` or \`unit\`, what to return, the data feed value or the unit where it was posted, default is \`value\`;
* \`type\`: string, optional, \`auto\` or \`string\`, what type to return, default is \`auto\`.  For \`auto\`, data feed values that look like valid IEEE754 numbers are returned as numbers, otherwise they are returned as strings.  If \`string\`, the returned value is always a string.  This setting affects only the values extracted from the database; if \`ifnone\` is used, the original type of \`ifnone\` value is always preserved.

Data feeds are searched before the MCI of the triggering unit (inclusively).  If there are several AAs stemming from the same MCI, previous AA responses are also searched.

Examples:

	\`{
	data_feed[[oracles='JPQKPRI5FMTQRJF4ZZMYZYDQVRD55OTC', feed_name='BTC_USD']]
	data_feed[[oracles=this address, feed_name='score']]
	data_feed[[oracles='JPQKPRI5FMTQRJF4ZZMYZYDQVRD55OTC:I2ADHGP4HL6J37NQAD73J7E5SKFIXJOT', feed_name='timestamp']]
	}\`
`
		}
	},
	{
		quoted: false,
		label: 'in_data_feed',
		insertText: 'in_data_feed',
		kind: monaco.languages.CompletionItemKind.Keyword,
		detail: '`in_data_feed` external reference',
		documentation: {
			value:
`
	\`{
	in_data_feed[[oracles=listOfOracles, feed_name=nameOfDataFeed, feed_value>feedValue, ...]]
	}\`

Determines if a data feed can be found by search criteria.  Returns \`true\` or \`false\`.  This adds +1 to complexity.

There are multiple search criteria listed between the double brackets, their order is insignificant.
* \`oracles\`: string, list of oracle addresses delimited by \`:\` (usually only one oracle). \`this address\` is also a valid oracle address and it refers to the current AA;
* \`feed_name\`: string, the name of the data feed;
* \`feed_value\`: string or number, search only for values of the data feed that are \`=\`, \`!=\`, \`>\`, \`>=\`, \`<\`, or \`<=\` than the specified value;
* \`min_mci\`: number, optional, search only since the specified MCI.

Data feeds are searched before the MCI of the triggering unit (inclusively).  If there are several AAs stemming from the same MCI, previous AA responses are also searched.

Examples:

	\`{
	in_data_feed[[oracles='JPQKPRI5FMTQRJF4ZZMYZYDQVRD55OTC', feed_name='BTC_USD', feed_value > 12345.67]]
	in_data_feed[[oracles=this address, feed_name='score', feed_value=$score]]
	in_data_feed[[oracles='JPQKPRI5FMTQRJF4ZZMYZYDQVRD55OTC:I2ADHGP4HL6J37NQAD73J7E5SKFIXJOT', feed_name='timestamp', feed_value>=1.5e9]]
	}\`
`
		}
	},
	{
		quoted: false,
		label: 'attestation',
		insertText: 'attestation',
		kind: monaco.languages.CompletionItemKind.Keyword,
		detail: '`attestation` external reference',
		documentation: {
			value:
`
	\`{
	attestation[[attestors=listOfAttestors, address=attestedAddress, ...]].field
	attestation[[attestors=listOfAttestors, address=attestedAddress, ...]][field_expr]
	}\`

Finds an attestation by search criteria.  This adds +1 to complexity.

There are multiple search criteria listed between the double brackets, their order is insignificant.
* \`attestors\`: string, list of attestor addresses delimited by \`:\` (usually only one attestor). \`this address\` is also a valid attestor address and it refers to the current AA;
* \`address\`: string, the address that was attested;
* \`ifseveral\`: string, optional, \`last\` or \`abort\`, what to do if several matching attestations are found, return the last one or abort the script with error, default is \`last\`
* \`ifnone\`: string or number or boolean, optional, the value to return if nothing is found.  By default, this results in an error and aborts the script;
* \`type\`: string, optional, \`auto\` or \`string\`, what type to return, default is \`auto\`.  For \`auto\`, attested field values that look like valid IEEE754 numbers are returned as numbers, otherwise they are returned as strings.  If \`string\`, the returned value is always a string.  This setting affects only the values extracted from the database; if \`ifnone\` is used, the original type of \`ifnone\` value is always preserved.

\`field\` string or \`field_expr\` expression are optional and they indicate the attested field whose value should be returned.  Without \`field\` or \`field_expr\`, \`true\` is returned if an attestation is found.

If no matching attestation is found, \`ifnone\` value is returned (independently of \`field\`).  If there is no \`ifnone\`, \`false\` is returned.

If a matching attestation exists but the requested field does not, the result is as if the attestation did not exist.

Attestations are searched before the MCI of the triggering unit (inclusively).  If there are several AAs stemming from the same MCI, previous AA responses are also searched.

Examples:

	\`{
	attestation[[attestors='UOYYSPEE7UUW3KJAB5F4Y4AWMYMDDB4Y', address='BI2MNEVU4EFWL4WSBILFK7GGMVNS2Q3Q']].email
	attestation[[attestors=this address, address=trigger.address]]
	attestation[[attestors='JEDZYC2HMGDBIDQKG3XSTXUSHMCBK725', address='TSXOWBIK2HEBVWYTFE6AH3UEAVUR2FIF', ifnone='anonymous']].steem_username
	attestation[[attestors='JEDZYC2HMGDBIDQKG3XSTXUSHMCBK725', address='TSXOWBIK2HEBVWYTFE6AH3UEAVUR2FIF']].reputation
	}\`
`
		}
	},
	{
		quoted: false,
		label: 'input',
		insertText: 'input',
		kind: monaco.languages.CompletionItemKind.Keyword,
		detail: '`input` external reference',
		documentation: {
			value:
`
	\`{
	input[[asset=assetID, amount=amountValue, address=inputAddress]].field
	}\`

Tries to find an input in the current unit by search criteria.

These language constructs are available only in non-AA formulas in smart contracts (\`["formula", ...]\` clause).

There are multiple search criteria listed between the double brackets, their order is insignificant.  All search criteria are optional but at least one must be present.
* \`asset\`: string, asset of input, can be \`base\` for bytes.  Comparison operators can be only \`=\` or \`!=\`;
* \`address\`: string, the address receives spends an input, can be \`this address\` or \`other address\`.  Comparison operators can be only \`=\` or \`!=\`;
* \`amount\`: number, the condition for the amount of an input.  Allowed comparison operators are: \`=\`, \`!=\`, \`>\`, \`>=\`, \`<\`, \`<=\`.

\`field\` is one of \`amount\`, \`address\`, and \`asset\`.  It indicates which information about the input we are interested in.

If no input is found by search criteria or there is more than one matching entry, the formula fails.

Examples:

	\`{
	input[[asset=base]].amount
	}\`
`
		}
	},
	{
		quoted: false,
		label: 'output',
		insertText: 'output',
		kind: monaco.languages.CompletionItemKind.Keyword,
		detail: '`output` external reference',
		documentation: {
			value:
`
	\`{
	output[[asset=assetID, amount>minAmount, address=outputAddress]].field
	}\`

Tries to find an output in the current unit by search criteria.

These language constructs are available only in non-AA formulas in smart contracts (\`["formula", ...]\` clause).

There are multiple search criteria listed between the double brackets, their order is insignificant.  All search criteria are optional but at least one must be present.
* \`asset\`: string, asset of or output, can be \`base\` for bytes.  Comparison operators can be only \`=\` or \`!=\`;
* \`address\`: string, the address receives an output, can be \`this address\` or \`other address\`.  Comparison operators can be only \`=\` or \`!=\`;
* \`amount\`: number, the condition for the amount of an output.  Allowed comparison operators are: \`=\`, \`!=\`, \`>\`, \`>=\`, \`<\`, \`<=\`.

\`field\` is one of \`amount\`, \`address\`, and \`asset\`.  It indicates which information about the output we are interested in.

If no output is found by search criteria or there is more than one matching entry, the formula fails.

Examples:

	\`{
	output[[asset = base, address=GFK3RDAPQLLNCMQEVGGD2KCPZTLSG3HN]].amount
	output[[asset = base, address="GFK3RDAPQLLNCMQEVGGD2KCPZTLSG3HN"]].amount
	output[[asset = "n9y3VomFeWFeZZ2PcSEcmyBb/bI7kzZduBJigNetnkY=", amount>=100]].address
	}\`
`
		}
	},
	{
		label: 'sqrt',
		insertText: 'sqrt',
		kind: monaco.languages.CompletionItemKind.Function,
		detail: '`sqrt` built-in',
		documentation: {
			value:
`
\`sqrt(number)\`
This function adds +1 to complexity count.

Negative numbers cause an error.  Non-number inputs are converted to numbers or result in error.
`
		}
	},
	{
		label: 'ln',
		insertText: 'ln',
		kind: monaco.languages.CompletionItemKind.Function,
		detail: '`ln` built-in',
		documentation: {
			value:
`
\`ln(number)\`
This function adds +1 to complexity count.

Negative numbers cause an error. Non-number inputs are converted to numbers or result in error.
`
		}
	},
	{
		label: 'abs',
		insertText: 'abs',
		kind: monaco.languages.CompletionItemKind.Function,
		detail: '`abs` built-in',
		documentation: {
			value:
`
\`abs(number)\`
Returns absolute value of a number. Non-number inputs are converted to numbers or result in error.
`
		}
	},
	{
		label: 'round',
		insertText: 'round',
		kind: monaco.languages.CompletionItemKind.Function,
		detail: '`round` built-in',
		documentation: {
			value:
`
\`round(number [, decimal_places])\`

Rounds the input number to the specified number of decimal places (0 if omitted). \`round\` uses \`ROUND_HALF_EVEN\` rules.  Non-number inputs are converted to numbers or result in error. Negative or non-integer \`decimal_places\` results in error. \`decimal_places\` greater than 15 results in error.
`
		}
	},
	{
		label: 'ceil',
		insertText: 'ceil',
		kind: monaco.languages.CompletionItemKind.Function,
		detail: '`ceil` built-in',
		documentation: {
			value:
`
\`ceil(number [, decimal_places])\`

Rounds the input number to the specified number of decimal places (0 if omitted). \`round\` uses \`ROUND_HALF_EVEN\` rules.  Non-number inputs are converted to numbers or result in error. Negative or non-integer \`decimal_places\` results in error. \`decimal_places\` greater than 15 results in error.
`
		}
	},
	{
		label: 'floor',
		insertText: 'floor',
		kind: monaco.languages.CompletionItemKind.Function,
		detail: '`floor` built-in',
		documentation: {
			value:
`
\`floor(number [, decimal_places])\`

Rounds the input number to the specified number of decimal places (0 if omitted). \`round\` uses \`ROUND_HALF_EVEN\` rules.  Non-number inputs are converted to numbers or result in error. Negative or non-integer \`decimal_places\` results in error. \`decimal_places\` greater than 15 results in error.
`
		}
	},
	{
		label: 'min',
		insertText: 'min',
		kind: monaco.languages.CompletionItemKind.Function,
		detail: '`min` built-in',
		documentation: {
			value:
`
\`min(number1, [number2[, number3[, ...]]])\`

Returns minimum among the set of numbers.  Non-number inputs are converted to numbers or result in error.
`
		}
	},
	{
		label: 'max',
		insertText: 'max',
		kind: monaco.languages.CompletionItemKind.Function,
		detail: '`max` built-in',
		documentation: {
			value:
`
\`max(number1, [number2[, number3[, ...]]])\`

Returns maximum among the set of numbers.  Non-number inputs are converted to numbers or result in error.
`
		}
	},
	{
		label: 'hypot',
		insertText: 'hypot',
		kind: monaco.languages.CompletionItemKind.Function,
		detail: '`hypot` built-in',
		documentation: {
			value:
`
\`hypot(number1, [number2[, number3[, ...]]])\`

Returns the square root of the sum of squares of all arguments.  Boolean parameters are converted to 1 and 0, objects are taken as 1, all other types result in error.  The function returns a non-infinity result even if some intermediary results (squares) would overflow.

This function adds +1 to complexity count.
`
		}
	},
	{
		label: 'json_parse',
		insertText: 'json_parse',
		kind: monaco.languages.CompletionItemKind.Function,
		detail: '`json_parse` built-in',
		documentation: {
			value:
`
\`json_parse(string)\`

Attempts to parse the input JSON string. If the result of parsing is an object, the object is returned.  If the result is a scalar (boolean, string, number), the scalar is returned.

This function adds +1 to complexity count.

If parsing fails, \`false\` is returned.

Non-string input is converted to string.
`
		}
	},
	{
		label: 'json_stringify',
		insertText: 'json_stringify',
		kind: monaco.languages.CompletionItemKind.Function,
		detail: '`json_stringify` built-in',
		documentation: {
			value:
`
\`json_stringify(string)\`

Stringifies the input parameter into JSON.  The parameter can also be a number, boolean, or string.  If it is a number outside the IEEE754 range, the formula fails.  Objects in the returned JSON are sorted by keys.
`
		}
	},
	{
		label: 'number_from_seed',
		insertText: 'number_from_seed',
		kind: monaco.languages.CompletionItemKind.Function,
		detail: '`number_from_seed` built-in',
		documentation: {
			value:
`
	\`{
	number_from_seed(string)
	number_from_seed(string, max)
	number_from_seed(string, min, max)
	}\`

Generates a number from a seed string. The same seed always produces the same number. The numbers generated from different seed strings are uniformly distributed in the specified interval.

The first form returns a fractional number from 0 to 1.

The second form returns an integer number from 0 to max inclusive.

The third form returns an integer number from min to max inclusive.

This function is useful for generating pseudorandom numbers from a seed string.  It adds +1 to complexity count.
`
		}
	},
	{
		label: 'sha256',
		insertText: 'sha256',
		kind: monaco.languages.CompletionItemKind.Function,
		detail: '`sha256` built-in',
		documentation: {
			value:
`
	\`{
	sha256(string)
	}\`

Returns sha256 of input string in base64 encoding.  Non-string inputs are converted to strings. This function adds +1 to complexity count.
`
		}
	},
	{
		label: 'is_valid_signed_package',
		insertText: 'is_valid_signed_package',
		kind: monaco.languages.CompletionItemKind.Function,
		detail: '`is_valid_signed_package` built-in',
		documentation: {
			value:
`
	\`{
		is_valid_signed_package(signedPackage, address)
	}\`

Returns \`true\` if \`signedPackage\` object is a valid signed package signed by address \`address\`, returns \`false\` otherwise (the formula doesn't fail even if \`signedPackage\` doesn't have the correct format). \`address\` must be a valid address, otherwise the expression fails with an error. This function adds +1 to complexity count.

\`signedPackage\` object is usually passed through the trigger and has the following structure:

	\`{
		{
			"signed_message": {
				"field1": "value1",
				"field2": "value2",
				...
			},
			"authors": [
				{
					"address": "2QHG44PZLJWD2H7C5ZIWH4NZZVB6QCC7",
					"authentifiers": {
						"r": "MFZ0eFJeLAgAmm6BJdvbEzNt7x0H2Fb5RQBBpMSmyVFMLM2r2SX5chU9hbEWXExkz/T2hXAk1qHmxkAbbpZw8w=="
					}
				}
			],
			"last_ball_unit": "izgjyn9bpbJjwpKQV7my0Dq1VUHbzrLpWLrdR0fDydw=",
			"version": "2.0"
		}
	}\`

Here:
* \`signed_message\` is the message being signed, it can be an object, an array, or scalar;
* \`authors\` is an array of authors who signed the message (usually one), it has the same structure as unit authors and includes the signing address, authentifiers (usually signatures) and optionally definitions;
* \`last_ball_unit\`: optional unit of last ball that indicates the position on the DAG at which the message was signed. If definition is not included in \`author\`, it must be known at this point in the ledger history. If there is no \`last_ball_unit\` in \`signedPackage\`, including address definition as part of each \`author\` is required;
* \`version\`: always \`2.0\`.

Usually, \`signedPackage\` is created by calling \`signMessage\` function from \`signed_message\` module:

	\`{
		var headlessWallet = require('headless-obyte');
		var signed_message = require('ocore/signed_message.js');

		signed_message.signMessage(message, address, headlessWallet.signer, true, function (err, signedPackage) {
			// handle result here
			trigger.data.signedPackage = signedPackage;
		});
	}\`

The function creates a correctly structured \`signedPackage\` object which can be added to \`trigger.data\`.
`
		}
	},
	{
		label: 'bounce',
		insertText: 'bounce',
		kind: monaco.languages.CompletionItemKind.Function,
		detail: '`bounce` built-in',
		documentation: {
			value:
`
	\`{
	bounce(string)
	}\`

Aborts the script's execution with error message passed as the function's argument. The received money will be bounced to sender (less bounce fees).
`
		}
	},
	{
		label: 'oracles',
		insertText: 'oracles',
		kind: monaco.languages.CompletionItemKind.Module,
		detail: '`oracles` search criteria',
		documentation: {
			value:
`
\`oracles\`: string, list of oracle addresses delimited by \`:\` (usually only one oracle). \`this address\` is also a valid oracle address and it refers to the current AA;
`
		}
	},
	{
		label: 'feed_name',
		insertText: 'feed_name',
		kind: monaco.languages.CompletionItemKind.Module,
		detail: '`feed_name` search criteria',
		documentation: {
			value:
`
\`feed_name\`: string, the name of the data feed;
`
		}
	},
	{
		label: 'feed_value',
		insertText: 'feed_value',
		kind: monaco.languages.CompletionItemKind.Module,
		detail: '`feed_value` search criteria',
		documentation: {
			value:
`
\`feed_value\`: string or number, optional, search only for this specific value of the data feed;
`
		}
	},
	{
		label: 'ifseveral',
		insertText: 'ifseveral',
		kind: monaco.languages.CompletionItemKind.Module,
		detail: '`ifseveral` search criteria',
		documentation: {
			value:
`
\`ifseveral\`: string, optional, \`last\` or \`abort\`, what to do if several values found that match all the search criteria, return the last one or abort
`
		}
	},
	{
		label: 'ifnone',
		insertText: 'ifnone',
		kind: monaco.languages.CompletionItemKind.Module,
		detail: '`ifnone` search criteria',
		documentation: {
			value:
`
\`ifnone\`: string or number or boolean, optional, the value to return if nothing is found.  By default, this results in an error and aborts the script;
`
		}
	},
	{
		label: 'what',
		insertText: 'what',
		kind: monaco.languages.CompletionItemKind.Module,
		detail: '`what` search criteria',
		documentation: {
			value:
`
\`what\`: string, optional, \`value\` or \`unit\`, what to return, the data feed value or the unit where it was posted, default is \`value\`;
`
		}
	},
	{
		label: 'type',
		insertText: 'type',
		kind: monaco.languages.CompletionItemKind.Module,
		detail: '`type` search criteria',
		documentation: {
			value:
`
\`type\`: string, optional, \`auto\` or \`string\`, what type to return, default is \`auto\`.  For \`auto\`, data feed values that look like valid IEEE754 numbers are returned as numbers, otherwise they are returned as strings.  If \`string\`, the returned value is always a string.  This setting affects only the values extracted from the database; if \`ifnone\` is used, the original type of \`ifnone\` value is always preserved.
`
		}
	},
	{
		label: 'attestors',
		insertText: 'attestors',
		kind: monaco.languages.CompletionItemKind.Module,
		detail: '`attestors` search criteria',
		documentation: {
			value:
`
\`attestors\`: string, list of attestor addresses delimited by \`:\` (usually only one attestor). \`this address\` is also a valid attestor address and it
`
		}
	},
	{
		label: 'address',
		insertText: 'address',
		kind: monaco.languages.CompletionItemKind.Module,
		detail: '`address` search criteria',
		documentation: {
			value:
`
\`address\`: string, the address that was attested;
`
		}
	},
	{
		label: 'balance',
		insertText: 'balance',
		kind: monaco.languages.CompletionItemKind.Keyword,
		detail: '`balance` keyword',
		documentation: {
			value:
`
	\`{
	balance[asset]
	balance[aa_address][asset]
	}\`

Returns the balance of an AA in the specified asset.  If \`aa_address\` is omitted, the current AA is assumed.  \`asset\` can be \`base\` for bytes, asset id for any other asset, or any expression that evaluates to an asset id or \`base\` string.

This adds +1 to complexity count.

The returned balance includes the outputs received from the current trigger.

Examples:

	\`{
	balance[base]
	balance["n9y3VomFeWFeZZ2PcSEcmyBb/bI7kzZduBJigNetnkY="]
	balance["JVUJQ7OPBJ7ZLZ57TTNFJIC3EW7AE2RY"][base]
	}\`
`
		}
	},
	{
		label: 'response',
		insertText: 'response',
		kind: monaco.languages.CompletionItemKind.Keyword,
		detail: '`response` keyword',
		documentation: {
			value:
`
	\`{
	response['key'] = 'text';
	}\`

Adds a key to the response object.  Response variables do not affect state, they are meant to only inform the caller, and other interested parties, about the actions performed by the AA.

Response vars can only be assigned, never read.  Response vars can be assigned and reassigned multiple times in any oscript.  They can hold values of types: string, number, boolean.  Attempting to assign an object would result in \`true\` being assigned.

Example: assigning these response variables

	\`{
	response['message'] = "set exchange rate to 0.123 tokens/byte";
	response['deposit'] = 2250000;
	}\`

will result in the following response object:

	\`{
	{
		"responseVars": {
				"message": "set exchange rate to 0.123 tokens/byte",
				"deposit": 2250000
		}
	}
	}\`
`
		}
	},
	{
		label: 'base',
		insertText: 'base',
		kind: monaco.languages.CompletionItemKind.Text
	},
	{
		label: 'asset',
		insertText: 'asset',
		kind: monaco.languages.CompletionItemKind.Text
	},
	{
		label: 'amount',
		insertText: 'amount',
		kind: monaco.languages.CompletionItemKind.Text
	},
	{
		label: 'pi',
		insertText: 'pi',
		kind: monaco.languages.CompletionItemKind.Constant,
		detail: '`pi` 3.14159265358979',
		documentation: {
			value:
`
Pi constant rounded to 15 digits precision: 3.14159265358979.
`
		}
	},
	{
		label: 'e',
		insertText: 'e',
		kind: monaco.languages.CompletionItemKind.Constant,
		detail: '`e` 2.71828182845905',
		documentation: {
			value:
`
Euler's number rounded to 15 digits precision: 2.71828182845905.
`
		}
	},
	{
		label: 'or',
		insertText: 'or',
		kind: monaco.languages.CompletionItemKind.Keyword
	},
	{
		label: 'and',
		insertText: 'and',
		kind: monaco.languages.CompletionItemKind.Keyword
	},
	{
		label: 'not',
		insertText: 'not',
		kind: monaco.languages.CompletionItemKind.Keyword
	},
	{
		label: 'otherwise',
		insertText: 'otherwise',
		kind: monaco.languages.CompletionItemKind.Keyword
	}
]
