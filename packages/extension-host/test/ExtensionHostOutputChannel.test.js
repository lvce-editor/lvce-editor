import EventEmitter from 'events'
import * as ExtensionHostOutputChannel from '../src/parts/ExtensionHostOutputChannel/ExtensionHostOutputChannel.js'

beforeEach(() => {
  ExtensionHostOutputChannel.state.outputChannels = []
})

// TODO this should not crash extension host
test('registerOutputChannel - error - null', () => {
  expect(() => {
    ExtensionHostOutputChannel.registerOutputChannel(null)
  }).toThrowError(
    new TypeError("Cannot read properties of null (reading 'id')")
  )
})

test('registerOutputChannel - error - missing property id', () => {
  expect(() => {
    ExtensionHostOutputChannel.registerOutputChannel({
      emitter: new EventEmitter(),
    })
  }).toThrowError(new TypeError('expected value to be of type string'))
})

test('registerOutputChannel - error - missing property emitter', () => {
  expect(() => {
    ExtensionHostOutputChannel.registerOutputChannel({
      id: 'test',
    })
    // TODO better error message
  }).toThrowError(new TypeError('expected value to be of type object'))
})

// TODO this should also not crash extension host
test('registerOutputChannel - error - emitter.addListener is not a function', () => {
  expect(() => {
    ExtensionHostOutputChannel.registerOutputChannel({
      id: 'test',
      emitter: {},
    })
  }).toThrowError(
    new TypeError('outputChannel.emitter.addListener is not a function')
  )
})

test('handleData', () => {
  const emitter = new EventEmitter()
  ExtensionHostOutputChannel.registerOutputChannel({
    id: 'test',
    emitter,
  })
  emitter.emit('data', 'abc')
  // TODO error message should be better
})

// TODO this should not crash extension host
test('handleData - error - null', () => {
  const emitter = new EventEmitter()
  ExtensionHostOutputChannel.registerOutputChannel({
    id: 'test',
    emitter,
  })
  expect(() => {
    emitter.emit('data', null)
    // TODO error message should be better
  }).toThrowError(new Error('expected value to be of type string'))
})
