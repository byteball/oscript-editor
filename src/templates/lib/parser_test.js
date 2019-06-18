export default `{
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
