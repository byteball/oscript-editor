/* eslint-disable camelcase */
import send_all from './lib/send_all'
import simple_aa from './lib/simple_aa'
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
import bouncer_infinite_cycle from './lib/bouncer_infinite_cycle'
import uniswap_like_market_maker from './lib/uniswap_like_market_maker'
import sending_prepared_objects_through_trigger_data from './lib/sending_prepared_objects_through_trigger_data'
import a51_attack_game from './lib/51_attack_game'
import fundraising_proxy from './lib/fundraising_proxy'

export default {
	send_all,
	simple_aa,
	just_a_bouncer,
	create_an_asset,
	option_contract,
	payment_channels,
	futures_contract,
	forwarder_of_bytes,
	order_book_exchange,
	sell_asset_for_bytes,
	bounce_half_of_balance,
	a_bank_without_percent,
	bouncer_infinite_cycle,
	uniswap_like_market_maker,
	sending_prepared_objects_through_trigger_data,
	'51_attack_game': a51_attack_game,
	fundraising_proxy
}
