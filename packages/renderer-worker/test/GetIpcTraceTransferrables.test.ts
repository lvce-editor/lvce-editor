import { expect, test } from '@jest/globals'
import * as GetIpcTraceTransferrables from '../src/parts/GetIpcTraceTransferrables/GetIpcTraceTransferrables.ts'

test('finds array buffers through typed arrays without duplicating them', () => {
  const buffer = new ArrayBuffer(8)
  const value = {
    buffer,
    typedArray: new Uint8Array(buffer),
  }
  expect(GetIpcTraceTransferrables.getIpcTraceTransferrables(value)).toEqual([buffer])
})

test('supports cyclic messages', () => {
  const value: any = { buffer: new ArrayBuffer(4) }
  value.self = value
  expect(GetIpcTraceTransferrables.getIpcTraceTransferrables(value)).toEqual([value.buffer])
})
