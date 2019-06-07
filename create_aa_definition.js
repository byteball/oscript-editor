/*jslint node: true */
"use strict";
var headlessWallet = require('headless-obyte');
var eventBus = require('ocore/event_bus.js');
var objectHash = require('ocore/object_hash.js');

function onError(err){
	throw Error(err);
}


function composeContentJoint(from_address, app, payload, signer, callbacks){
	var composer = require('ocore/composer.js');
	var objMessage = {
		app: app,
		payload_location: "inline",
		payload_hash: objectHash.getBase64Hash(payload),
		payload: payload
	};
	composer.composeJoint({
		paying_addresses: [from_address], 
		outputs: [{address: from_address, amount: 0}], 
		messages: [objMessage], 
		signer: signer, 
		callbacks: callbacks
	});
}

function createDefinition(my_address){
	var composer = require('ocore/composer.js');
	var network = require('ocore/network.js');
	var callbacks = composer.getSavingCallbacks({
		ifNotEnoughFunds: onError,
		ifError: onError,
		ifOk: function(objJoint){
			network.broadcastJoint(objJoint);
		}
	});
	/*
	// just a bouncer
	var arrDefinition = ['autonomous agent', {
		bounce_fees: { base: 10000 },
		messages: [
			{
				app: 'payment',
				payload: {
					asset: 'base',
					outputs: [
						{address: "{trigger.address}", amount: "{trigger.output[[asset=base]] - 1000}"}
					]
				}
			}
		]
	}];*/

	/*
	// bounce half of balance
	var arrDefinition = ['autonomous agent', {
		bounce_fees: { base: 10000 },
		messages: [
			{
				app: 'payment',
				payload: {
					asset: 'base',
					outputs: [
						{address: "{trigger.address}", amount: "{ round(balance[base]/2) }"}
					]
				}
			}
		]
	}];
	"is_private", "is_transferrable", "auto_destroy", "fixed_denominations", "issued_by_definer_only", "cosigned_by_definer", "spender_attested"
	*/

	/*
	// create an asset
	var arrDefinition = ['autonomous agent', {
		bounce_fees: { base: 11000 },
		messages: {
			cases: [
				{
					if: "{trigger.data.define}",
					messages: [
						{
							app: 'asset',
							payload: {
								cap: "{trigger.data.cap otherwise ''}",
								is_private: false,
								is_transferrable: true,
								auto_destroy: "{!!trigger.data.auto_destroy}",
								fixed_denominations: false,
								issued_by_definer_only: "{!!trigger.data.issued_by_definer_only}",
								cosigned_by_definer: false,
								spender_attested: "{!!trigger.data.attestor1}",
								attestors: [
									"{trigger.data.attestor1 otherwise ''}",
									"{trigger.data.attestor2 otherwise ''}",
									"{trigger.data.attestor3 otherwise ''}",
								]
							}
						},
						{
							app: 'state',
							state: "{ var[response_unit] = trigger.address; }"
						}
					]
				},
				{
					if: "{trigger.data.issue AND trigger.data.asset AND var[trigger.data.asset] == trigger.address}",
					messages: [{
						app: 'payment',
						payload: {
							asset: "{trigger.data.asset}",
							outputs: [
								{address: "{trigger.address}", amount: "{trigger.data.amount}"}
							]
						}
					}]
				},
			]
		}
	}];*/

	/*
	// sell asset for bytes
	var arrDefinition = ['autonomous agent', {
		messages: {
			cases: [
				{ // withdraw funds
					if: "{trigger.data.withdraw AND trigger.data.asset AND trigger.data.amount AND trigger.address == '"+my_address+"'}",
					messages: [{
						app: 'payment',
						payload: {
							asset: "{trigger.data.asset}",
							outputs: [
								{address: "{trigger.address}", amount: "{trigger.data.amount}"}
							]
						}
					}]
				},
				{ // update exchange rate
					if: "{trigger.data.exchange_rate AND trigger.address == '"+my_address+"'}",
					messages: [{
						app: 'state',
						state: "{ var['rate'] = trigger.data.exchange_rate; response['message'] = 'set exchange rate to '||var['rate']||' tokens/byte'; }"  // asset-units/byte
					}]
				},
				{ // exchange
					if: "{trigger.output[[asset=base]] > 100000}",
					init: "{ $bytes_amount = trigger.output[[asset=base]]; $asset_amount = round($bytes_amount * var['rate']); response['message'] = 'exchanged '||$bytes_amount||' bytes for '||$asset_amount||' asset.'; }",
					messages: [{
						app: 'payment',
						payload: {
							asset: "n9y3VomFeWFeZZ2PcSEcmyBb/bI7kzZduBJigNetnkY=",
							outputs: [
								{address: "{trigger.address}", amount: "{ $asset_amount }"}
							]
						}
					}]
				},
				{ // silently accept coins
					messages: [{
						app: 'state',
						state: "{ response['message'] = 'accepted coins: '||trigger.output[[asset=base]]||' bytes and '||trigger.output[[asset='n9y3VomFeWFeZZ2PcSEcmyBb/bI7kzZduBJigNetnkY=']]||' tokens.'; }"
					}]
				},
			]
		}
	}];*/

	/*
	// a bank (without %)
	var arrDefinition = ['autonomous agent', {
		messages: {
			cases: [
				{ // withdraw funds
					if: `{
						$key = 'balance_'||trigger.address||'_'||trigger.data.asset;
						$base_key = 'balance_'||trigger.address||'_'||'base';
						$fee = 1000;
						$required_amount = trigger.data.amount + ((trigger.data.asset == 'base') ? $fee : 0);
						trigger.data.withdraw AND trigger.data.asset AND trigger.data.amount AND $required_amount <= var[$key] AND $fee <= var[$base_key]
					}`,
					messages: [
						{
							app: 'payment',
							payload: {
								asset: "{trigger.data.asset}",
								outputs: [
									{address: "{trigger.address}", amount: "{trigger.data.amount}"}
								]
							}
						},
						{
							app: 'state',
							state: `{
								var[$key] = var[$key] - trigger.data.amount;
								var[$base_key] = var[$base_key] - $fee;
							}`
						}
					]
				},
				{ // silently accept coins
					if: "{!trigger.data.withdraw}",
					messages: [{
						app: 'state',
						state: `{
							$asset = trigger.output[[asset!=base]].asset;
							if ($asset == 'ambiguous')
								bounce('ambiguous asset');
							if (trigger.output[[asset=base]] > 10000){
								$base_key = 'balance_'||trigger.address||'_'||'base';
								var[$base_key] = var[$base_key] + trigger.output[[asset=base]];
								$response_base = trigger.output[[asset=base]] || ' bytes\n';
							}
							if ($asset != 'none'){
								$asset_key = 'balance_'||trigger.address||'_'||$asset;
								var[$asset_key] = var[$asset_key] + trigger.output[[asset=$asset]];
								$response_asset = trigger.output[[asset=$asset]] || ' of ' || $asset || '\n';
							}
							response['message'] = 'accepted coins:\n' || ($response_base otherwise '') || ($response_asset otherwise '');
						}`
					}]
				},
			]
		}
	}];*/
	
	/*
	// order book exchange
	var arrDefinition = ['autonomous agent', {
		messages: {
			cases: [
				{ // withdraw funds
					if: `{
						$key = 'balance_'||trigger.address||'_'||trigger.data.asset;
						trigger.data.withdraw AND trigger.data.asset AND trigger.data.amount AND trigger.data.amount <= var[$key]
					}`,
					messages: [
						{
							app: 'payment',
							payload: {
								asset: "{trigger.data.asset}",
								outputs: [
									{address: "{trigger.address}", amount: "{trigger.data.amount}"}
								]
							}
						},
						{
							app: 'state',
							state: `{
								var[$key] = var[$key] - trigger.data.amount;
							}`
						}
					]
				},
				{ // execute orders, order1 must be smaller or the same as order2; order2 is partially filled
					if: `{
						$order1 = trigger.data.order1.signed_message;
						$order2 = trigger.data.order2.signed_message;
						if (!$order1.sell_asset OR !$order2.sell_asset)
							return false;
						if ($order1.sell_asset != $order2.buy_asset OR $order1.buy_asset != $order2.sell_asset)
							return false;
						
						// to do check expiry
						
						$sell_key1 = 'balance_' || $order1.address || '_' || $order1.sell_asset;
						$sell_key2 = 'balance_' || $order2.address || '_' || $order2.sell_asset;
						
						$id1 = sha256($order1.address || $order1.sell_asset || $order1.buy_asset || $order1.sell_amount || $order1.price || trigger.data.order1.last_ball_unit);
						$id2 = sha256($order2.address || $order2.sell_asset || $order2.buy_asset || $order2.sell_amount || $order2.price || trigger.data.order2.last_ball_unit);
						
						if (var['executed_' || $id1] OR var['executed_' || $id2])
							return false;

						if (!is_valid_signed_package(trigger.data.order1, $order1.address)
							OR !is_valid_signed_package(trigger.data.order2, $order2.address))
							return false;

						$amount_left1 = var['amount_left_' || $id1] otherwise $order1.sell_amount;
						$amount_left2 = var['amount_left_' || $id2] otherwise $order2.sell_amount;

						if ($amount_left1 > var[$sell_key1] OR $amount_left2 > var[$sell_key2])
							return false;

						$buy_amount1 = round($amount_left1 * $order1.price);
						if ($buy_amount1 > $amount_left2) // order1 is not the smaller one
							return false;
						$expected_buy_amount2 = round($buy_amount1 * $order2.price);
						if ($expected_buy_amount2 > $amount_left1) // user2 doesn't like the price, he gets less than expects
							return false;

						true
					}`,
					messages: [{
						app: 'state',
						state: `{
							$buy_key1 = 'balance_' || $order1.address || '_' || $order1.buy_asset;
							$buy_key2 = 'balance_' || $order2.address || '_' || $order2.buy_asset;
							$base_key1 = 'balance_' || $order1.address || '_base';
							$base_key2 = 'balance_' || $order2.address || '_base';

							var[$sell_key1] = var[$sell_key1] - $amount_left1;
							var[$sell_key2] = var[$sell_key2] - $buy_amount1;
							var[$buy_key1] = var[$buy_key1] + $buy_amount1;
							var[$buy_key2] = var[$buy_key2] + $amount_left1;

							$fee = 1000;
							var[$base_key1] = var[$base_key1] - $fee;
							var[$base_key2] = var[$base_key2] - $fee;
							if (var[$base_key1] < 0 OR var[$base_key2] < 0)
								bounce('not enough balance for fees');
							
							var['executed_' || $id1] = 1;
							$new_amount_left2 = $amount_left2 - $buy_amount1;
							if ($new_amount_left2)
								var['amount_left_' || $id2] = $new_amount_left2;
							else
								var['executed_' || $id2] = 1;

							// parsable response for transaction log
							response[$order1.address || '_' || $order1.sell_asset] = -$amount_left1;
							response[$order2.address || '_' || $order2.buy_asset] = $amount_left1;
							response[$order1.address || '_' || $order1.buy_asset] = $buy_amount1;
							response[$order2.address || '_' || $order2.sell_asset] = -$buy_amount1;
						}`
					}]
				},
				{ // silently accept coins
					if: "{!trigger.data}",
					messages: [{
						app: 'state',
						state: `{
							$asset = trigger.output[[asset!=base]].asset;
							if ($asset == 'ambiguous')
								bounce('ambiguous asset');
							if (trigger.output[[asset=base]] > 10000){
								$base_key = 'balance_'||trigger.address||'_'||'base';
								var[$base_key] = var[$base_key] + trigger.output[[asset=base]];
								$response_base = trigger.output[[asset=base]] || ' bytes\n';
							}
							if ($asset != 'none'){
								$asset_key = 'balance_'||trigger.address||'_'||$asset;
								var[$asset_key] = var[$asset_key] + trigger.output[[asset=$asset]];
								$response_asset = trigger.output[[asset=$asset]] || ' of ' || $asset || '\n';
							}
							response['message'] = 'accepted coins:\n' || ($response_base otherwise '') || ($response_asset otherwise '');
						}`
					}]
				},
			]
		}
	}];*/
	

	/*
	// option contract
	var expiry_date = Math.round(Date.UTC(2019, 4, 1)/1000); // in seconds
	var arrDefinition = ['autonomous agent', {
		messages: {
			cases: [
				{ // define YES and NO assets
					if: `{
						$define_yes = trigger.data.define_yes AND !var['yes_asset'];
						$define_no = trigger.data.define_no AND !var['no_asset'];
						if ($define_yes AND $define_no)
							bounce("can't define both assets at the same time");
						$define_yes OR $define_no
					}`,
					messages: [
						{
							app: 'asset',
							payload: {
								// without cap
								is_private: false,
								is_transferrable: true,
								auto_destroy: false,
								fixed_denominations: false,
								issued_by_definer_only: true,
								cosigned_by_definer: false,
								spender_attested: false,
							}
						},
						{
							app: 'state',
							state: `{
								$asset = $define_yes ? 'yes_asset' : 'no_asset';
								var[$asset] = response_unit;
								response[$asset] = response_unit;
							}`
						}
					]
				},
				{ // issue YES and NO assets in exchange for bytes
					if: "{trigger.output[[asset=base]] >= 1e5 AND var['yes_asset'] AND var['no_asset']}",
					messages: [
						{
							app: 'payment',
							payload: {
								asset: "{var['yes_asset']}",
								outputs: [
									{address: "{trigger.address}", amount: "{ trigger.output[[asset=base]] }"}
								]
							}
						},
						{
							app: 'payment',
							payload: {
								asset: "{var['no_asset']}",
								outputs: [
									{address: "{trigger.address}", amount: "{ trigger.output[[asset=base]] }"}
								]
							}
						},
					]
				},
				{ // record the outcome
					if: `{(trigger.data.winner == 'yes' OR trigger.data.winner == 'no') AND !var['winner']}`,
					messages: [{
						app: 'state',
						state: `{
							if (trigger.data.winner == 'yes' AND data_feed[[oracles='X55IWSNMHNDUIYKICDW3EOYAWHRUKANP', feed_name='GBYTE_USD']] > 60)
								var['winner'] = 'yes';
							else if (trigger.data.winner == 'no' AND data_feed[[oracles='ZQFHJXFWT2OCEBXF26GFXJU4MPASWPJT', feed_name='timestamp']] > ${expiry_date * 1000})
								var['winner'] = 'no';
							else
								bounce('suggested outcome not confirmed');
							response['winner'] = trigger.data.winner;
						}`
					}]
				},
				{ // pay bytes in exchange for the winning asset
					if: "{trigger.output[[asset!=base]] > 1000 AND var['winner'] AND trigger.output[[asset!=base]].asset == var[var['winner'] || '_asset']}",
					messages: [{
						app: 'payment',
						payload: {
							asset: "base",
							outputs: [
								{address: "{trigger.address}", amount: "{ trigger.output[[asset!=base]] }"}
							]
						}
					}]
				},
			]
		}
	}];*/

	/*
	// futures contract
	var expiry_date = Math.round(Date.UTC(2019, 3, 14)/1000); // in seconds
	var arrDefinition = ['autonomous agent', {
		messages: {
			cases: [
				{ // define USD and GB assets
					if: `{
						$define_usd = trigger.data.define_usd AND !var['usd_asset'];
						$define_gb = trigger.data.define_gb AND !var['gb_asset'];
						if ($define_usd AND $define_gb)
							bounce("can't define both assets at the same time");
						$define_usd OR $define_gb
					}`,
					messages: [
						{
							app: 'asset',
							payload: {
								// without cap
								is_private: false,
								is_transferrable: true,
								auto_destroy: false,
								fixed_denominations: false,
								issued_by_definer_only: true,
								cosigned_by_definer: false,
								spender_attested: false,
							}
						},
						{
							app: 'state',
							state: `{
								$asset = $define_usd ? 'usd_asset' : 'gb_asset';
								var[$asset] = response_unit;
								response[$asset] = response_unit;
							}`
						}
					]
				},
				{ // issue USD and GB assets in exchange for bytes, it's ok to issue them even after expiry or blackswan
					if: "{trigger.output[[asset=base]] >= 1e5 AND var['usd_asset'] AND var['gb_asset']}",
					messages: [
						{
							app: 'payment',
							payload: {
								asset: "{var['usd_asset']}",
								outputs: [
									{address: "{trigger.address}", amount: "{ trigger.output[[asset=base]] }"}
								]
							}
						},
						{
							app: 'payment',
							payload: {
								asset: "{var['gb_asset']}",
								outputs: [
									{address: "{trigger.address}", amount: "{ trigger.output[[asset=base]] }"}
								]
							}
						},
					]
				},
				{ // record blackswan event
					if: `{ trigger.data.blackswan AND !var['blackswan'] AND data_feed[[oracles='X55IWSNMHNDUIYKICDW3EOYAWHRUKANP', feed_name='GBYTE_USD_MA']] < 25 AND data_feed[[oracles='ZQFHJXFWT2OCEBXF26GFXJU4MPASWPJT', feed_name='timestamp']] < ${expiry_date * 1000} }`,
					messages: [{
						app: 'state',
						state: `{
							var['blackswan'] = 1;
							response['blackswan'] = 1;
						}`
					}]
				},
				// 1 GB is now 50 USD, 1 byte is 50e-9 = 5e-8 USD
				// 1 usd asset is always 2.5e-8 USD, 1 gb asset is 1 byte minus 2.5e-8 USD
				{ // pay bytes in exchange for the assets
					if: `{
						if (trigger.output[[asset!=base]].asset == 'none')
							return false;
						$gb_asset_amount = trigger.output[[asset=var['gb_asset']]];
						$usd_asset_amount = trigger.output[[asset=var['usd_asset']]];
						if ($gb_asset_amount < 1e4 AND $usd_asset_amount < 1e4)
							return false;
						if ($gb_asset_amount == $usd_asset_amount){ // helps in case the exchange rate is never posted
							$bytes = $gb_asset_amount;
							return true;
						}
						if (var['blackswan'])
							$bytes = $usd_asset_amount;
						else{
							$ts = data_feed[[oracles='ZQFHJXFWT2OCEBXF26GFXJU4MPASWPJT', feed_name='timestamp']];
							if ($ts < ${expiry_date * 1000})
								bounce('wait for maturity date');
							// data_feed will abort if the exchange rate not posted yet
							$exchange_rate = data_feed[[oracles='X55IWSNMHNDUIYKICDW3EOYAWHRUKANP', feed_name='GBYTE_USD_MA_2019_04_30']];
							$bytes_per_usd_asset = min(50/$exchange_rate/2, 1);
							$bytes_per_gb_asset = 1 - $bytes_per_usd_asset;
							$bytes = round($bytes_per_usd_asset * $usd_asset_amount + $bytes_per_gb_asset * $gb_asset_amount);
						}
						true
					}`,
					messages: [{
						app: 'payment',
						payload: {
							asset: "base",
							outputs: [
								{address: "{trigger.address}", amount: "{ $bytes }"}
							]
						}
					}]
				},
			]
		}
	}];*/

	
	/*
	// uniswap-like market maker
	var arrDefinition = ['autonomous agent', {
		init: `{
			$asset = 'n9y3VomFeWFeZZ2PcSEcmyBb/bI7kzZduBJigNetnkY=';
			$mm_asset = var['mm_asset'];
		}`,
		messages: {
			cases: [
				{ // define share asset
					if: `{ trigger.data.define AND !$mm_asset }`,
					messages: [
						{
							app: 'asset',
							payload: {
								// without cap
								is_private: false,
								is_transferrable: true,
								auto_destroy: false,
								fixed_denominations: false,
								issued_by_definer_only: true,
								cosigned_by_definer: false,
								spender_attested: false,
							}
						},
						{
							app: 'state',
							state: `{
								var['mm_asset'] = response_unit;
								response['mm_asset'] = response_unit;
							}`
						}
					]
				},
				{ // invest in MM
					if: `{$mm_asset AND trigger.output[[asset=base]] > 1e5 AND trigger.output[[asset=$asset]] > 0}`,
					init: `{
						$asset_balance = balance[$asset] - trigger.output[[asset=$asset]];
						$bytes_balance = balance[base] - trigger.output[[asset=base]];
						if ($asset_balance == 0 OR $bytes_balance == 0){ // initial deposit
							$issue_amount = balance[base];
							return;
						}
						$current_ratio = $asset_balance / $bytes_balance;
						$expected_asset_amount = round($current_ratio * trigger.output[[asset=base]]);
						if ($expected_asset_amount != trigger.output[[asset=$asset]])
							bounce('wrong ratio of amounts, expected ' || $expected_asset_amount || ' of asset');
						$investor_share_of_prev_balance = trigger.output[[asset=base]] / $bytes_balance;
						$issue_amount = round($investor_share_of_prev_balance * var['mm_asset_outstanding']);
					}`,
					messages: [
						{
							app: 'payment',
							payload: {
								asset: "{$mm_asset}",
								outputs: [
									{address: "{trigger.address}", amount: "{ $issue_amount }"}
								]
							}
						},
						{
							app: 'state',
							state: `{
								var['mm_asset_outstanding'] += $issue_amount;
							}`
						},
					]
				},
				{ // divest MM shares 
					// (user is already paying 10000 bytes bounce fee which is a divest fee)
					// the price slightly moves due to fees received and paid in bytes
					if: `{$mm_asset AND trigger.output[[asset=$mm_asset]]}`,
					init: `{
						$mm_asset_amount = trigger.output[[asset=$mm_asset]];
						$investor_share = $mm_asset_amount / var['mm_asset_outstanding'];
					}`,
					messages: [
						{
							app: 'payment',
							payload: {
								asset: "{$asset}",
								outputs: [
									{address: "{trigger.address}", amount: "{ round($investor_share * balance[$asset]) }"}
								]
							}
						},
						{
							app: 'payment',
							payload: {
								asset: "base",
								outputs: [
									{address: "{trigger.address}", amount: "{ round($investor_share * balance[base]) }"}
								]
							}
						},
						{
							app: 'state',
							state: `{
								var['mm_asset_outstanding'] -= trigger.output[[asset=$mm_asset]];
							}`
						},
					]
				},
				{ // exchange bytes to asset
					if: `{trigger.output[[asset=base]] > 1e5 AND trigger.output[[asset=$asset]] == 0 AND var['mm_asset_outstanding']}`,
					init: `{
						$asset_balance = balance[$asset] - trigger.output[[asset=$asset]];
						$bytes_balance = balance[base] - trigger.output[[asset=base]];
						// other formula can be used for product, e.g. $asset_balance * $bytes_balance ^ 2
						$p = $asset_balance * $bytes_balance;
						$new_asset_balance = round($p / balance[base]);
						$amount = $asset_balance - $new_asset_balance; // we can deduct exchange fees here
					}`,
					messages: [
						{
							app: 'payment',
							payload: {
								asset: "{$asset}",
								outputs: [
									{address: "{trigger.address}", amount: "{ $amount }"}
								]
							}
						},
					]
				},
				{ // exchange asset to bytes
					if: `{trigger.output[[asset=$asset]] > 0 AND var['mm_asset_outstanding']}`,
					init: `{
						$asset_balance = balance[$asset] - trigger.output[[asset=$asset]];
						$bytes_balance = balance[base] - trigger.output[[asset=base]]; // 10Kb fee
						// other formula can be used for product, e.g. $asset_balance * $bytes_balance ^ 2
						$p = $asset_balance * $bytes_balance;
						$new_bytes_balance = round($p / balance[$asset]);
						$amount = $bytes_balance - $new_bytes_balance; // we can deduct exchange fees here
					}`,
					messages: [
						{
							app: 'payment',
							payload: {
								asset: "base",
								outputs: [
									{address: "{trigger.address}", amount: "{ $amount }"}
								]
							}
						},
					]
				},
			]
		}
	}];
	*/

	/*
	// forwarder of bytes
	var arrDefinition = ['autonomous agent', {
		messages: [
			{
				if: `{trigger.output[[asset=base]] > 2000}`,
				app: 'payment',
				payload: {
					asset: "base",
					outputs: [
						{ address: "PCEJIRXNA56T6VQOOSPV6GOJVLVN6AO6", amount: "{ trigger.output[[asset=base]] - 2000 }" }
					]
				}
			},
		]
	}];*/

	/*
	// bouncer (trying to get infinite cycle)
	var arrDefinition = ['autonomous agent', {
		messages: [
			{
				if: `{trigger.output[[asset=base]] > 2000}`,
				app: 'payment',
				payload: {
					asset: "base",
					outputs: [
						{ address: "{trigger.address == '2QHG44PZLJWD2H7C5ZIWH4NZZVB6QCC7' ? 'PCEJIRXNA56T6VQOOSPV6GOJVLVN6AO6' : trigger.address}", amount: "{ trigger.output[[asset=base]] - 2000 }" }
					]
				}
			},
			{
				if: `{
					$asset = trigger.output[[asset!=base]].asset;
					$asset != 'none' AND $asset != 'ambiguous'
				}`,
				app: 'payment',
				payload: {
					asset: "{$asset}",
					outputs: [
						{ address: "{trigger.address == '2QHG44PZLJWD2H7C5ZIWH4NZZVB6QCC7' ? 'PCEJIRXNA56T6VQOOSPV6GOJVLVN6AO6' : trigger.address}", amount: "{ trigger.output[[asset!=base]] }" }
					]
				}
			},
		]
	}];*/

	/*
	// sending prepared objects through trigger.data
	var arrDefinition = ['autonomous agent', {
		messages: [
			{
				if: `{trigger.data.d}`,
				app: 'data',
				payload: `{trigger.data.d}`
			},
			{
				if: `{trigger.data.sub}`,
				app: 'data',
				payload: {
					xx: 66.3,
					sub: `{trigger.data.sub}`
				}
			},
			{
				if: `{trigger.data.output}`,
				app: 'payment',
				payload: {
					asset: "base",
					outputs: [
						`{trigger.data.output}`
					]
				}
			},
			{
				if: `{trigger.data.payment}`,
				app: 'payment',
				payload: `{trigger.data.payment}`
			},
		]
	}];*/

	/*
	// send all
	var arrDefinition = ['autonomous agent', {
		messages: {
			cases: [
				{
					if: `{trigger.output[[asset=base]] >= 1e6}`,
					messages: [{
						app: 'payment',
						payload: {
							asset: 'base',
							outputs: [
								{ address: '{trigger.address}' }
							]
						}
					}]
				},
				{
					messages: [{
						app: 'payment',
						payload: {
							asset: 'base',
							outputs: [
								{ address: 'X55IWSNMHNDUIYKICDW3EOYAWHRUKANP', amount: `{round(trigger.output[[asset=base]]/2)}` },
								{ address: '{trigger.address}' },
							]
						}
					}]
				},
			]
		}
	}];*/

	
	// payment channels
	var arrDefinition = ['autonomous agent', {
		init: `{
			$close_timeout = 300;
			$addressA = '2QHG44PZLJWD2H7C5ZIWH4NZZVB6QCC7';
			$addressB = 'X55IWSNMHNDUIYKICDW3EOYAWHRUKANP';
			$bFromA = (trigger.address == $addressA);
			$bFromB = (trigger.address == $addressB);
			$bFromParties = ($bFromA OR $bFromB);
			if ($bFromParties)
				$party = $bFromA ? 'A' : 'B';
		}`,
		messages: {
			cases: [
				{ // refill the AA
					if: `{ $bFromParties AND trigger.output[[asset=base]] >= 1e5 }`,
					messages: [
						{
							app: 'state',
							state: `{
								if (var['close_initiated_by'])
									bounce('already closing');
								if (!var['period'])
									var['period'] = 1;
								$key = 'balance' || $party;
								var[$key] += trigger.output[[asset=base]];
								response[$key] = var[$key];
							}`
						}
					]
				},
				{ // start closing
					if: `{ $bFromParties AND trigger.data.close AND !var['close_initiated_by'] }`,
					messages: [
						{
							app: 'state',
							state: `{
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
								$finalBalanceA = var['balanceA'] - var['spentByA'] + var['spentByB'];
								$finalBalanceB = var['balanceB'] - var['spentByB'] + var['spentByA'];
								if ($finalBalanceA < 0 OR $finalBalanceB < 0)
									bounce('one of the balances would become negative');
								var['close_initiated_by'] = $party;
								var['close_start_ts'] = timestamp;
								response['close_start_ts'] = timestamp;
								response['finalBalanceA'] = $finalBalanceA;
								response['finalBalanceB'] = $finalBalanceB;
							}`
						},
					]
				},
				{ // confirm closure
					if: `{ trigger.data.confirm AND var['close_initiated_by'] }`,
					init: `{
						if (!($bFromParties AND var['close_initiated_by'] != $party OR timestamp > var['close_start_ts'] + $close_timeout))
							bounce('too early');
						$finalBalanceA = var['balanceA'] - var['spentByA'] + var['spentByB'];
						$finalBalanceB = var['balanceB'] - var['spentByB'] + var['spentByA'];
					}`,
					messages: [
						{
							app: 'payment',
							payload: {
								asset: "base",
								outputs: [
									// fees are paid by the larger party, its output is send-all
									// this party also collects the accumulated 10Kb bounce fees
									{address: "{$addressA}", amount: "{ $finalBalanceA < $finalBalanceB ? $finalBalanceA : '' }"},
									{address: "{$addressB}", amount: "{ $finalBalanceA >= $finalBalanceB ? $finalBalanceB : '' }"},
								]
							}
						},
						{
							app: 'state',
							state: `{
								var['period'] += 1;
								var['close_initiated_by'] = false;
								var['close_start_ts'] = false;
								var['balanceA'] = false;
								var['balanceB'] = false;
								var['spentByA'] = false;
								var['spentByB'] = false;
							}`
						},
					]
				},
				{ // fraud proof
					if: `{ trigger.data.fraud_proof AND var['close_initiated_by'] AND trigger.data.sentByPeer }`,
					init: `{
						$bInitiatedByA = (var['close_initiated_by'] == 'A');
						if (trigger.data.sentByPeer.signed_message.channel != this_address)
							bounce('signed for another channel');
						if (trigger.data.sentByPeer.signed_message.period != var['period'])
							bounce('signed for a different period of this channel');
						if (!is_valid_signed_package(trigger.data.sentByPeer, $bInitiatedByA ? $addressA : $addressB))
							bounce('invalid signature by peer');
						$transferredFromPeer = trigger.data.sentByPeer.signed_message.amount_spent;
						if ($transferredFromPeer < 0)
							bounce('bad amount spent by peer: ' || $transferredFromPeer);
						$transferredFromPeerAsClaimedByPeer = var['spentBy' || ($bInitiatedByA ? 'A' : 'B')];
						if ($transferredFromPeer <= $transferredFromPeerAsClaimedByPeer)
							bounce("the peer didn't lie in his favor");
					}`,
					messages: [
						{
							app: 'payment',
							payload: {
								asset: "base",
								outputs: [
									// send all
									{address: "{trigger.address}"},
								]
							}
						},
						{
							app: 'state',
							state: `{
								var['period'] += 1;
								var['close_initiated_by'] = false;
								var['close_start_ts'] = false;
								var['balanceA'] = false;
								var['balanceB'] = false;
								var['spentByA'] = false;
								var['spentByB'] = false;
							}`
						},
					]
				},
			]
		}
	}];


	var aa_address = objectHash.getChash160(arrDefinition);
	console.log('--- AA address', aa_address);
	var payload = { address: aa_address, definition: arrDefinition };
	composeContentJoint(my_address, 'definition', payload, headlessWallet.signer, callbacks);
}

eventBus.on('headless_wallet_ready', function () {
	headlessWallet.readFirstAddress(function (my_address) {
		createDefinition(my_address);
	});
});
