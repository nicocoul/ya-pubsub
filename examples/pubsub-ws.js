const { WebSocketServer } = require('ws')
const ya = require('../index.js')

const broker = ya.broker()
broker.plug(ya.plugins.ws(new WebSocketServer({ port: 8001 })))
broker.publish('some-topic', 'hello')

const client1 = ya.client.ws({ host: 'localhost', port: 8001 })
const client2 = ya.client.ws({ host: 'localhost', port: 8001 })

client2.publish('some-topic', { hello: 'world1' })

client2.subscribe('some-topic', (message) => {
  console.log(message)
})

setTimeout(() => {
  client1.publish('some-topic', { hello: 'world2' })
}, 50)

/* output:
hello
{ hello: 'world1' }
{ hello: 'world2' }
*/
