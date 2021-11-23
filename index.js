'use strict'
const yac = require('ya-common')
const clients = require('./lib/clients')
const brokers = require('./lib/brokers')

module.exports = {
  broker: brokers.pubsub,
  client: {
    net: (options) => {
      const tcpChannel = yac.channels.net(options.host, options.port)
      return clients.pubsub(tcpChannel)
    },
    ws: (options) => {
      const wsChannel = yac.channels.ws(options.host, options.port, options.ssl)
      return clients.pubsub(wsChannel)
    }
  },
  plugins: yac.plugins
}
