export default {
	id: 'ojson',
	tokensProvider: {
		keywords: [
			'true', 'false'
		],

		// C# style strings
		escapes: /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,
		whites: /[ \t\r\n]+/,

		tokenizer: {
			root: [
				// identifiers and keywords
				[/[a-z_$][\w$]*/, { cases: { '@keywords': 'keyword',
					'@default': '' } }],

				// whitespace
				{ include: '@whitespace' },

				// delimiters and operators
				[/[{}[\]]/, '@brackets'],

				// numbers
				[/\d*\.\d+([eE][-+]?\d+)?/, 'number.float'],
				[/0[xX][0-9a-fA-F]+/, 'number.hex'],
				[/\d+/, 'number'],

				// delimiter: after number because of .\d floats
				[/[;,.:]/, 'delimiter'],

				// strings
				[/"([^"\\]|\\.)*$/, 'string.invalid'],
				[/'([^'\\]|\\.)*$/, 'string.invalid'],
				[/"@whites*{/, { token: 'string', next: '@oscript_double', nextEmbedded: 'oscript' }],
				[/'@whites*{/, { token: 'string', next: '@oscript_single', nextEmbedded: 'oscript' }],
				[/`@whites*{/, { token: 'string', next: '@oscript_backtick', nextEmbedded: 'oscript' }],
				[/"/, { token: 'string.quote', bracket: '@open', next: '@string_double' }],
				[/`/, { token: 'string.quote', bracket: '@open', next: '@string_backtick' }],
				[/'/, { token: 'string.quote', bracket: '@open', next: '@string_single' }],

				// characters
				[/'[^\\']'/, 'string'],
				[/(')(@escapes)(')/, ['string', 'string.escape', 'string']],
				[/'/, 'string.invalid']
			],

			comment: [
				[/[^/*]+/, 'comment'],
				[/\/\*/, 'comment', '@push'], // nested comment
				['\\*/', 'comment', '@pop'],
				[/[/*]/, 'comment']
			],

			string_double: [
				[/[^\\"]+/, 'string'],
				[/@escapes/, 'string.escape'],
				[/\\./, 'string.escape.invalid'],
				[/"/, { token: 'string.quote', bracket: '@close', next: '@pop' }]
			],

			string_single: [
				[/[^\\']+/, 'string'],
				[/@escapes/, 'string.escape'],
				[/\\./, 'string.escape.invalid'],
				[/'/, { token: 'string.quote', bracket: '@close', next: '@pop' }]
			],
			string_backtick: [
				[/[^\\`]+/, 'string'],
				[/@escapes/, 'string.escape'],
				[/\\./, 'string.escape.invalid'],
				[/`/, { token: 'string.quote', bracket: '@close', next: '@pop' }]
			],

			oscript_double: [
				[/}@whites*"/, { token: 'string', next: '@pop', nextEmbedded: '@pop' }]
			],
			oscript_single: [
				[/}@whites*'/, { token: 'string', next: '@pop', nextEmbedded: '@pop' }]
			],
			oscript_backtick: [
				[/}@whites*`/, { token: 'string', next: '@pop', nextEmbedded: '@pop' }]
			],

			whitespace: [
				[/@whites/, 'white'],
				[/\/\*/, 'comment', '@comment'],
				[/\/\/.*$/, 'comment']
			]
		}
	},
	codeStub:
`{
  single: 'quote',
  double: "quote",
  backtick: \`quote\`,
  "key": "with quote",
  oscriptCode: \`{
    $transferredFromMe = trigger.data.transferredFromMe otherwise 0;
    if ($transferredFromMe < 0)
      bounce('bad amount spent by me: ' || $transferredFromMe);
    if (trigger.data.sentByPeer){
      if (trigger.data.sentByPeer.signed_message.channel != this_address)
        bounce('signed for another channel');
      if (trigger.data.sentByPeer.signed_message.period != var['period'])
        bounce('signed for a different period of this channel');
      if (!is_valid_signed_package(trigger.data.sentByPeer, $bFromB ? $addressA : $addressB))
        bounce('invalid signature by peer');
      $transferredFromPeer = trigger.data.sentByPeer.signed_message.amount_spent;
      if ($transferredFromPeer < 0)
        bounce('bad amount spent by peer: ' || $transferredFromPeer);
    }
    else
      $transferredFromPeer = 0;
    var['spentByA'] = $bFromA ? $transferredFromMe : $transferredFromPeer;
    var['spentByB'] = $bFromB ? $transferredFromMe : $transferredFromPeer;
    $finalBalanceA = var["balanceA"] - var['spentByA'] + var['spentByB'];
    $finalBalanceB = var['balanceB'] - var['spentByB'] + var['spentByA'];
    if ($finalBalanceA < 0 OR $finalBalanceB < 0)
      bounce('one of the balances would become negative');
    var['close_initiated_by'] = $party.x;
    var['close_start_ts'] = timestamp;
    response['clos\n'e_start_ts'] = timestamp;
    response['finalBalanceA'] = $finalBalanceA;
    response['finalBalanceB'] = $finalBalanceB;
    data_feed[[oracles=this address, feed_name='ggg']]
    // comment
    /* comm
    ent
    */
  }\`,
  number: 100,
  hex: 0x100,
  float: 1.00,
  boolean: true,
}`
}
