const pubsub = require('../index.js')

const broker = pubsub.broker()

broker.publish('some-topic', 'hello')

broker.subscribe('some-topic', (message) => {
  console.log('received from first subscriber', message)
})

broker.subscribe('some-topic', (message) => {
  console.log('received from second subscriber', message)
})

setTimeout(() => {
  broker.publish('some-topic', { hello: 'world2' })
}, 50)

/* output:
received from first subscriber hello
received from second subscriber hello
received from first subscriber { hello: 'world2' }
received from second subscriber { hello: 'world2' }
*/
