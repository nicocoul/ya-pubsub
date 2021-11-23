const net = require('net')
const ya = require('../index.js')

const broker = ya.broker()
broker.plug(ya.plugins.net(net.Server().listen(8000)))

broker.publish('some-topic', 'hello')

const client1 = ya.client.net({ host: 'localhost', port: 8000 })
const client2 = ya.client.net({ host: 'localhost', port: 8000 })

client1.publish('some-topic', { hello: 'world1' })

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
