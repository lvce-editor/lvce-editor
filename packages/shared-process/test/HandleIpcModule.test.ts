import { expect, test } from '@jest/globals'
import * as HandleIpcModule from '../src/parts/HandleIpcModule/HandleIpcModule.js'
import * as HandleIpcSharedProcess from '../src/parts/HandleIpcSharedProcess/HandleIpcSharedProcess.js'
import * as IpcId from '../src/parts/IpcId/IpcId.js'

test('shared process', async () => {
  expect(HandleIpcModule.getModule(IpcId.SharedProcess)).toBe(HandleIpcSharedProcess)
})
