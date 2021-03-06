export default `{
	messages: {
		cases: [
			{
				if: \`{trigger.output[[asset=base]] >= 1e6}\`,
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
							{ address: 'X55IWSNMHNDUIYKICDW3EOYAWHRUKANP', amount: \`{round(trigger.output[[asset=base]]/2)}\` },
							{ address: '{trigger.address}' }, // no amount here meaning that this output receives all the remaining coins
						]
					}
				}]
			},
		]
	}
}`
