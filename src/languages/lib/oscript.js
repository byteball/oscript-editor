export default {
  id: 'oscript',
  tokensProvider: {
    // Set defaultToken to invalid to see what you do not tokenize yet
    defaultToken: 'invalid',
    keywords: [
      'if', 'else', 'return', 'true', 'false'
    ],
    builtins: [
      'var', 'bounce', 'response', 'response_unit', 'timestamp', 'mci', 'this_address', 'base',
      'data_feed', 'in_data_feed',
      'attestation', 'balance',
      'address', 'amount', 'asset', 'attestors', 'ifseveral', 'ifnone', 'type',
      'oracles', 'feed_name', 'min_mci', 'feed_value', 'what',
      'min', 'max', 'pi', 'e', 'sqrt', 'ln', 'ceil', 'floor', 'round', 'abs', 'hypot',
      'is_valid_signed_package', 'sha256', 'json_parse', 'json_stringify'
    ],
    operators: [
      '=', '>', '<', '!', '?', ':', '==', '<=', '>=', '!=',
      '||', '+', '-', '*', '/', '^',
      '+=', '-=', '*=', '/=', '||=', 'OR', 'AND', 'NOT', 'OTHERWISE', 'or', 'and', 'not', 'otherwise'
    ],
    // we include these common regular expressions
    symbols: /[=><!?:|+\-*/^]+/,
    // C# style strings
    escapes: /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,
    // The main tokenizer for our languages
    tokenizer: {
      root: [
        // numbers
        [/\d*\.\d+([eE][-+]?\d+)?/, 'number.float'],
        [/\d+([eE][-+]?\d+)?/, 'number'],
        // identifiers and keywords
        [/this address/, 'keyword'],
        [/other address/, 'keyword'],
        [/trigger\.data/, 'keyword'],
        [/trigger\.address/, 'keyword'],
        [/trigger\.output/, 'keyword'],
        [/trigger\.unit/, 'keyword'],
        [/\w+\b/, { cases: { '@builtins': 'keyword',
          '@keywords': 'keyword',
          '@default': 'identifier'
        } }],
        [/\$\w+/, 'variable'],
        // whitespace
        { include: '@whitespace' },
        // delimiters and operators
        [/[{}()[\]]/, '@brackets'],
        //  [/[<>](?!@symbols)/, '@brackets'],
        [/@symbols/, { cases: { '@operators': 'operator' } }],
        [/OR|or|AND|and|NOT|not|otherwise|OTHERWISE/, 'operator'],
        // delimiter: after number because of .\d floats
        [/[;,.]/, 'delimiter'],
        // strings
        [/"([^"\\]|\\.)*$/, 'string.invalid'], // non-teminated string
        [/'([^'\\]|\\.)*$/, 'string.invalid'], // non-teminated string
        [/"/, 'string', '@string_double'],
        [/'/, 'string', '@string_single'],
        // characters
        [/'[^\\']'/, 'string'],
        [/(')(@escapes)(')/, ['string', 'string.escape', 'string']],
        [/'/, 'string.invalid']
      ],
      comment: [
        [/[^/*]+/, 'comment'],
        [/[/*]/, 'comment']
      ],
      string: [
        [/[^\\"]+/, 'string'],
        [/@escapes/, 'string.escape'],
        [/\\./, 'string.escape.invalid'],
        [/"/, { token: 'string.quote', bracket: '@close', next: '@pop' }]
      ],
      string_double: [
        [/[^\\"]+/, 'string'],
        [/@escapes/, 'string.escape'],
        [/\\./, 'string.escape.invalid'],
        [/"/, 'string', '@pop']
      ],
      string_single: [
        [/[^\\']+/, 'string'],
        [/@escapes/, 'string.escape'],
        [/\\./, 'string.escape.invalid'],
        [/'/, 'string', '@pop']
      ],
      whitespace: [
        [/[ \t\r\n]+/, 'white'],
        [/\/\*/, 'comment', '@comment'],
        [/\/\/.*$/, 'comment']
      ]
    }
  },
  codeStub: `$transferredFromMe = trigger.data.transferredFromMe otherwise 0;
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
response['clos\\n\\'e_start_ts'] = timestamp;
response['finalBalanceA'] = $finalBalanceA;
response['finalBalanceB'] = $finalBalanceB;
data_feed[[oracles=this address, feed_name='ggg']]
// comment
/* comm
ent
*/`
}
