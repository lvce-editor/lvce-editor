import { expect, test } from '@jest/globals'
import * as SerializeIpcTraceMessage from '../src/parts/SerializeIpcTraceMessage/SerializeIpcTraceMessage.js'

test('preserves JSON values and tags special values', () => {
  const value = {
    buffer: new ArrayBuffer(8),
    error: new TypeError('bad input'),
    number: 42n,
    typedArray: new Uint8Array(4),
  }
  const serialized = SerializeIpcTraceMessage.serializeIpcTraceMessage(value)
  expect(serialized).toMatchObject({
    buffer: { $type: 'ArrayBuffer', byteLength: 8 },
    error: { $type: 'TypeError', message: 'bad input', name: 'TypeError' },
    number: { $type: 'BigInt', value: '42' },
    typedArray: { $type: 'Uint8Array', byteLength: 4, length: 4 },
  })
})

test('represents cycles with references', () => {
  const value: any = { method: 'Lint.lint' }
  value.self = value
  expect(SerializeIpcTraceMessage.serializeIpcTraceMessage(value)).toEqual({
    method: 'Lint.lint',
    self: { $ref: 1 },
  })
})
