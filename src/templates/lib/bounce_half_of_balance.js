export default `{
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
}`
