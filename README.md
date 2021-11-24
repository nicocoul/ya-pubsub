Ya PubSub is a [topic-based](http://en.wikipedia.org/wiki/Publish–subscribe_pattern#Message_filtering) [publish/subscribe](http://en.wikipedia.org/wiki/Publish/subscribe) library for Node js.

Works well with [ya-rfc](https://www.npmjs.com/package/ya-rfc).

### Key Features
* asynchronous
* embeddable
* designed for micro-services


### Basic Example

PubSub over tcp:
```javascript
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

```
PubSub over websockets
```javascript
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

```
PubSub locally (same process)
```javascript
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

```

### Topic Filtering


## Versioning

Yaps-node uses [Semantic Versioning](http://semver.org/) for predictable versioning.

## Alternatives

These are a few alternative projects that also implement topic based publish subscribe in JavaScript.

* https://raw.githubusercontent.com/mroderick/PubSubJS/
* http://www.joezimjs.com/projects/publish-subscribe-jquery-plugin/
* http://amplifyjs.com/api/pubsub/
* http://radio.uxder.com/ — oriented towards 'channels', free of dependencies
* https://github.com/pmelander/Subtopic - supports vanilla, underscore, jQuery and is even available in NuGet