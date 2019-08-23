/* eslint-disable camelcase */
import send_all from './lib/send_all'
// import simple_aa from './lib/simple_aa'
import just_a_bouncer from './lib/just_a_bouncer'
import create_an_asset from './lib/create_an_asset'
import option_contract from './lib/option_contract'
import payment_channels from './lib/payment_channels'
import futures_contract from './lib/futures_contract'
import forwarder_of_bytes from './lib/forwarder_of_bytes'
import order_book_exchange from './lib/order_book_exchange'
import sell_asset_for_bytes from './lib/sell_asset_for_bytes'
import bounce_half_of_balance from './lib/bounce_half_of_balance'
import a_bank_without_percent from './lib/a_bank_without_percent'
// import bouncer_infinite_cycle from './lib/bouncer_infinite_cycle'
import uniswap_like_market_maker from './lib/uniswap_like_market_maker'
import sending_prepared_objects_through_trigger_data from './lib/sending_prepared_objects_through_trigger_data'
import a51_attack_game from './lib/51_attack_game'
import fundraising_proxy from './lib/fundraising_proxy'
import ico_with_milestones from './lib/ico_with_milestones'
import fixed_supply_crowdsale from './lib/fixed_supply_crowdsale'

export default {
//	simple_aa,
	'Just a bouncer': just_a_bouncer,
	'Forwarder of bytes': forwarder_of_bytes,
	'Bounce half of balance': bounce_half_of_balance,
	'Create an asset': create_an_asset,
	'Sell asset for Bytes': sell_asset_for_bytes,
	'Bank with deposits without interest': a_bank_without_percent,
	'Option contract': option_contract,
	'Futures contract': futures_contract,
	'Payment channels': payment_channels,
	'Order book exchange': order_book_exchange,
	//	bouncer_infinite_cycle,
	'Uniswap-like market maker': uniswap_like_market_maker,
	'Send all': send_all,
	'Sending prepared objects through trigger.data': sending_prepared_objects_through_trigger_data,
	'51% attack game': a51_attack_game,
	'Fundraising proxy': fundraising_proxy,
	'ICO with milestone based release of funds': ico_with_milestones,
	'Fixed supply crowdsale': fixed_supply_crowdsale
}
