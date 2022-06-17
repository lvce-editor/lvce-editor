import { jest } from '@jest/globals'
import * as QuickPickColorTheme from '../src/parts/QuickPick/QuickPickColorTheme.js'
import * as SharedProcess from '../src/parts/SharedProcess/SharedProcess.js'

test('getPlaceholder', () => {
  expect(QuickPickColorTheme.getPlaceholder()).toBe('Select Color Theme')
})

test('getPicks', async () => {
  SharedProcess.state.send = jest.fn((message) => {
    switch (message.method) {
      case 'ExtensionHost.getColorThemeNames':
        SharedProcess.state.receive({
          jsonrpc: '2.0',
          id: message.id,
          result: ['monokai', 'shades-of-purple', 'slime'],
        })
        break
      default:
        throw new Error('unexpected message')
    }
  })
  expect(await QuickPickColorTheme.getPicks()).toEqual([
    {
      label: 'monokai',
    },
    {
      label: 'shades-of-purple',
    },
    {
      label: 'slime',
    },
  ])
})

test.skip('getPicks - error', async () => {
  SharedProcess.state.send = jest.fn((message) => {
    switch (message.method) {
      case 'ExtensionHost.getColorThemeNames':
        SharedProcess.state.receive({
          jsonrpc: '2.0',
          id: message.id,
          error: {
            code: -32000,
            message: 'Color theme "undefined" not found in extensions folder',
            data: {},
          },
        })
        break
      default:
        throw new Error('unexpected message')
    }
  })
  await expect(QuickPickColorTheme.getPicks()).rejects.toThrowError(
    new Error('Color theme "undefined" not found in extensions folder')
  )
})

test.skip('selectPick', () => {
  expect(
    QuickPickColorTheme.selectPick({
      label: 'slime',
    })
  ).rejects.toThrowError(
    new Error('Color theme "undefined" not found in extensions folder')
  )
})

test.skip('selectPick - error', async () => {
  expect(
    await QuickPickColorTheme.selectPick({
      label: 'slime',
    })
  ).toEqual({
    command: 'hide',
  })
})

test('getNoResults', () => {
  expect(QuickPickColorTheme.getNoResults()).toEqual({
    label: 'No matching color themes found',
  })
})
