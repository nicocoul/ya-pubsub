const net = require('net')
const ya = require('../index.js')

const broker = ya.broker()
broker.plug(ya.plugins.net(net.Server().listen(8000)))

const client1 = ya.client.net({ host: 'localhost', port: 8000 })

client1.publish('some-topic', { hello: 'world1' })

const client2 = ya.client.net({ host: 'localhost', port: 8000 })
client2.subscribe('some-topic', (message) => {
  console.log(message)
})

client1.publish('some-topic', { hello: 'world2' })

/* output:
{ hello: 'world1' }
{ hello: 'world2' }
*/
