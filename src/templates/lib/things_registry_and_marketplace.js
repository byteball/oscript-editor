export default `/*

This AA allows to register and sell any things.
A thing can be anything: a physical object, a copyrighted work, a name, a NFT, ...
Each thing is identified by a unique ID.

Every thing is first registered.  When registered, it is assigned to the user who registered it.  Then, the owner can put the thing on sale and set a price. While the thing is on sale, any user can send the sell price to the AA, this amount will be forwarded to the past owner and the thing will be reassigned to the new owner.

Possible extensions:
- If a thing has a private key associated with it (e.g. the thing is a smart card a has smart card securely attached to it), send a signed message when registering in order to prove ownership.
- Allow things to be rented for a fee.
- Allow to borrow money using an owned thing as a collateral.  If the debt is not repaid in time, the lender can seize the thing.

*/

{
	init: \`{
		$id = trigger.data.id;
	}\`,
	messages: {
		cases: [
			{ // register a new thing and optionally put it on sale
				if: \`{trigger.data.register AND $id}\`,
				init: \`{
					if (var['owner_' || $id])
						bounce('thing ' || $id || ' already registered');
					if (trigger.data.sell){
						$price = trigger.data.price;
						if (!$price || !($price > 0) || round($price) != $price)
							bounce('please set a positive integer price');
					}
				}\`,
				messages: [
					{
						app: 'state',
						state: \`{
							var['owner_' || $id] = trigger.address;
							if (trigger.data.sell AND trigger.data.price)
								var['price_' || $id] = trigger.data.price;
							response['message'] = 'registered' || (trigger.data.sell AND trigger.data.price ? ' and put on sale for ' || trigger.data.price : '');
						}\`
					}
				]
			},
			{ // put a thing on sale or update its price
				if: \`{$id AND trigger.data.sell AND trigger.data.price}\`,
				init: \`{
					$owner = var['owner_' || $id];
					if (!$owner OR $owner != trigger.address)
						bounce('thing ' || $id || ' is not yours');
					if (!(trigger.data.price > 0) OR round(trigger.data.price) != trigger.data.price)
						bounce('please set an integer positive price');
				}\`,
				messages: [
					{
						app: 'state',
						state: \`{
							var['price_' || $id] = trigger.data.price;
							response['message'] = 'on sale for ' || trigger.data.price;
						}\`
					}
				]
			},
			{ // withdraw a thing from sale
				if: \`{$id AND trigger.data.withdraw_from_sale}\`,
				init: \`{
					$owner = var['owner_' || $id];
					if (!$owner OR $owner != trigger.address)
						bounce('thing ' || $id || ' is not yours');
				}\`,
				messages: [
					{
						app: 'state',
						state: \`{
							var['price_' || $id] = false; // no-price means not on sale
							response['message'] = 'withdrawn from sale';
						}\`
					}
				]
			},
			{ // buy a thing
				if: \`{$id AND trigger.data.buy}\`,
				init: \`{
					$owner = var['owner_' || $id];
					if (!$owner)
						bounce('no such thing: ' || $id);
					if ($owner == trigger.address)
						bounce('thing ' || $id || ' is already yours');
					$price = var['price_' || $id];
					if (!$price)
						bounce('thing ' || $id || ' is not on sale');
					$amount = trigger.output[[asset=base]];
					if ($amount < $price)
						bounce("the thing's price is " || $price || ", you sent only " || $amount);
					$change = $amount - $price;
				}\`,
				messages: [
					{
						app: 'payment',
						payload: {
							asset: 'base',
							outputs: [
								{address: "{$owner}", amount: "{$price}"},
								{if: "{$change > 0}", address: "{trigger.address}", amount: "{$change}"},
							]
						}
					},
					{
						app: 'state',
						state: \`{
							var['owner_' || $id] = trigger.address; // new owner
							var['price_' || $id] = false; // not on sale any more
							response['message'] = 'sold to ' || trigger.address;
						}\`
					}
				]
			},
		]
	}
}`
