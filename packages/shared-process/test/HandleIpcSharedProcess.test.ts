import { expect, test } from '@jest/globals'
import * as HandleIpcSharedProcess from '../src/parts/HandleIpcSharedProcess/HandleIpcSharedProcess.js'

test('upgradeMessagePort', () => {
  expect(HandleIpcSharedProcess.upgradeMessagePort()).toEqual({
    type: 'handle',
  })
})

test('upgradeWebSocket', () => {
  expect(HandleIpcSharedProcess.upgradeWebSocket()).toEqual({
    type: 'handle',
  })
})
