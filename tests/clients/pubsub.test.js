const { pause, newAccumulator, newDummyChannel } = require('../common')
const yac = require('ya-common')
const { COMMANDS } = yac.constants
const dut = require('../../lib/clients/pubsub')

describe('Pubsub client', () => {
  test('writes subscriptions to remote', async () => {
    const channel = newDummyChannel()
    const accumulator = newAccumulator()
    channel.remote.readable.pipe(accumulator)

    const pubsubClient = dut.create(channel)

    pubsubClient.subscribe('topic1', () => {})
    pubsubClient.subscribe('topic2', () => {}, { offset: 10 })
    pubsubClient.subscribe('topic3', () => {}, { offset: 10, filter: () => {} })
    await pause(10)
    pubsubClient.destroy()

    expect(accumulator.data()).toStrictEqual([{
      c: COMMANDS.SUBSCRIBE,
      id: 1,
      offset: 0,
      filter: undefined,
      topic: 'topic1'
    }, {
      c: COMMANDS.SUBSCRIBE,
      id: 2,
      offset: 10,
      filter: undefined,
      topic: 'topic2'
    }, {
      c: COMMANDS.SUBSCRIBE,
      id: 3,
      filter: '() => {}',
      offset: 10,
      topic: 'topic3'
    }
    ])
  })

  test('receives messages from remote', async () => {
    const channel = newDummyChannel()
    const pubsubClient = dut.create(channel)

    const received = []

    pubsubClient.subscribe('topic1', (m) => { received.push(m) })

    channel.remote.writable.write({ c: COMMANDS.PUBLISH, t: 'topic1', o: 0, m: 'message1' })
    channel.remote.writable.write({ c: COMMANDS.PUBLISH, t: 'topic1', o: 1, m: 'message2' })

    await pause(10)
    pubsubClient.destroy()

    expect(received).toStrictEqual(['message1', 'message2'])
  })

  test('receives messages from remote and skips duplicates', async () => {
    const channel = newDummyChannel()
    const pubsubClient = dut.create(channel)

    const received = []

    pubsubClient.subscribe('topic1', (m) => { received.push(m) })

    channel.remote.writable.write({ c: COMMANDS.PUBLISH, t: 'topic1', o: 0, m: 'message1' })
    channel.remote.writable.write({ c: COMMANDS.PUBLISH, t: 'topic1', o: 0, m: 'message1' })

    await pause(10)
    pubsubClient.destroy()

    expect(received).toStrictEqual(['message1'])
  })

  test('receives messages from remote only in ascending order', async () => {
    const channel = newDummyChannel()
    const pubsubClient = dut.create(channel)

    const received = []

    pubsubClient.subscribe('topic1', (m) => { received.push(m) })
    channel.remote.writable.write({ c: COMMANDS.PUBLISH, t: 'topic1', o: 5, m: 'message5' })
    channel.remote.writable.write({ c: COMMANDS.PUBLISH, t: 'topic1', o: 0, m: 'message0' })

    await pause(10)
    pubsubClient.destroy()

    expect(received).toStrictEqual(['message5'])
  })

  test('filters received messages from remote', async () => {
    const channel = newDummyChannel()
    const pubsubClient = dut.create(channel)

    const received = []

    pubsubClient.subscribe('topic1', (m) => { received.push(m) }, { filter: 'return m===1' })
    channel.remote.writable.write({ c: COMMANDS.PUBLISH, t: 'topic1', o: 0, m: 0 })
    channel.remote.writable.write({ c: COMMANDS.PUBLISH, t: 'topic1', o: 1, m: 1 })
    channel.remote.writable.write({ c: COMMANDS.PUBLISH, t: 'topic1', o: 2, m: 2 })

    await pause(10)
    pubsubClient.destroy()

    expect(received).toStrictEqual([1])
  })

  test('subscribes multiple times to the same topic', async () => {
    const channel = newDummyChannel()
    const pubsubClient = dut.create(channel)

    const received1 = []
    const received2 = []
    const received3 = []

    pubsubClient.subscribe('topic1', (m) => { received1.push(m) }, { filter: 'return m===1' })
    pubsubClient.subscribe('topic1', (m) => { received2.push(m) }, { filter: 'return m===0' })
    pubsubClient.subscribe('topic1', (m) => { received3.push(m) })
    channel.remote.writable.write({ c: COMMANDS.PUBLISH, t: 'topic1', o: 0, m: 0 })
    channel.remote.writable.write({ c: COMMANDS.PUBLISH, t: 'topic1', o: 1, m: 1 })
    channel.remote.writable.write({ c: COMMANDS.PUBLISH, t: 'topic1', o: 2, m: 2 })

    await pause(10)
    pubsubClient.destroy()

    expect(received1).toStrictEqual([1])
    expect(received2).toStrictEqual([0])
    expect(received3).toStrictEqual([0, 1, 2])
  })

  test('unsubscribes', async () => {
    const channel = newDummyChannel()
    const pubsubClient = dut.create(channel)

    const received1 = []

    pubsubClient.subscribe('topic1', (m) => { received1.push(m) })
    channel.remote.writable.write({ c: COMMANDS.PUBLISH, t: 'topic1', o: 0, m: 'x' })
    await pause(50)
    pubsubClient.unsubscribe('topic1')
    channel.remote.writable.write({ c: COMMANDS.PUBLISH, t: 'topic1', o: 1, m: 1 })
    channel.remote.writable.write({ c: COMMANDS.PUBLISH, t: 'topic1', o: 2, m: 2 })

    await pause(50)
    pubsubClient.destroy()

    expect(received1).toStrictEqual(['x'])
  })
})
