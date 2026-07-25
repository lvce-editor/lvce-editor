import { expect, jest, test } from '@jest/globals'
import * as IpcParentWithElectronUtilityProcess from '../src/parts/IpcParentWithElectronUtilityProcess/IpcParentWithElectronUtilityProcess.js'

test('wrap - ignores a null message with transferred ports', () => {
  let handleMessage: any
  const port = {
    on: jest.fn((event, listener) => {
      handleMessage = listener
    }),
  }
  const listener = jest.fn()
  const ipc = IpcParentWithElectronUtilityProcess.wrap(port)
  ipc.on('message', listener)

  expect(() => {
    handleMessage({
      data: null,
      ports: [{}],
    })
  }).not.toThrow()

  expect(listener).not.toHaveBeenCalled()
})
