import { beforeAll, afterAll, test, expect, beforeEach, afterEach } from '@jest/globals'
import * as GetCommandKeyBinding from '../src/parts/GetCommandKeyBinding/GetCommandKeyBinding.js'

test('getCommandKeyBinding - empty', () => {
  const keyBindings = []
  const command = ''
  expect(GetCommandKeyBinding.getCommandKeyBinding(keyBindings, command)).toBe(undefined)
})

test('getCommandKeyBinding - match', () => {
  const keyBindings = [
    {
      key: 123,
      command: 'test',
    },
  ]
  const command = 'test'
  expect(GetCommandKeyBinding.getCommandKeyBinding(keyBindings, command)).toEqual({
    key: 123,
    command: 'test',
  })
})
