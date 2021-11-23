'use strict'

const pubsubBroker = require('./pubsub')

module.exports = {
  pubsub: pubsubBroker.create
}
