import { expect, jest, test } from '@jest/globals'
import * as ApplyIncomingIpcResponse from '../src/parts/ApplyIncomingIpcResponse/ApplyIncomingIpcResponse.js'

test('applyIncomingIpcResponse - handle', async () => {
  const addEventListener = jest.fn()
  const target = {
    addEventListener,
  }

  await expect(ApplyIncomingIpcResponse.applyIncomingIpcResponse(target, { type: 'handle' }, 1)).resolves.toBeUndefined()

  expect(addEventListener).toHaveBeenCalledWith('message', expect.any(Function))
})

test('applyIncomingIpcResponse - send error', async () => {
  const error = new Error('Failed to send IPC')
  const target = {
    send(): never {
      throw error
    },
  }

  await expect(
    ApplyIncomingIpcResponse.applyIncomingIpcResponse(target, { method: 'Test.execute', params: [], type: 'send' }, 1),
  ).resolves.toBe(error)
})

test('applyIncomingIpcResponse - unexpected response', async () => {
  const error = await ApplyIncomingIpcResponse.applyIncomingIpcResponse({}, { type: 'unexpected' }, 1)

  expect(error).toEqual(new Error('unexpected response'))
})
