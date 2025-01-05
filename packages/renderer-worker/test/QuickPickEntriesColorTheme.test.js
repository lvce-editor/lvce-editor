import { beforeEach, expect, jest, test } from '@jest/globals'
import * as JsonRpcVersion from '../src/parts/JsonRpcVersion/JsonRpcVersion.js'
import * as QuickPickReturnValue from '../src/parts/QuickPickReturnValue/QuickPickReturnValue.js'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/RendererProcess/RendererProcess.js', () => {
  return {
    invoke: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})
jest.unstable_mockModule('../src/parts/SharedProcess/SharedProcess.js', () => {
  return {
    invoke: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})

const QuickPickEntriesColorTheme = await import('../src/parts/QuickPickEntriesColorTheme/QuickPickEntriesColorTheme.js')
const SharedProcess = await import('../src/parts/SharedProcess/SharedProcess.js')

test('getPlaceholder', () => {
  expect(QuickPickEntriesColorTheme.getPlaceholder()).toBe('Select Color Theme')
})

test.skip('getPicks', async () => {
  // @ts-ignore
  SharedProcess.invoke.mockImplementation((method, ...params) => {
    switch (method) {
      case 'ExtensionHost.getColorThemeNames':
        return ['monokai', 'shades-of-purple', 'slime']
      default:
        throw new Error('unexpected message')
    }
  })
  expect(await QuickPickEntriesColorTheme.getPicks()).toEqual(['monokai', 'shades-of-purple', 'slime'])
})

test.skip('getPicks - error', async () => {
  // @ts-ignore
  SharedProcess.state.send = jest.fn((message) => {
    // @ts-ignore
    switch (message.method) {
      case 'ExtensionHost.getColorThemeNames':
        // @ts-ignore
        SharedProcess.state.receive({
          jsonrpc: JsonRpcVersion.Two,
          // @ts-ignore
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
  await expect(QuickPickEntriesColorTheme.getPicks()).rejects.toThrow(new Error('Color theme "undefined" not found in extensions folder'))
})

test.skip('selectPick', () => {
  expect(
    QuickPickEntriesColorTheme.selectPick({
      label: 'slime',
    }),
  ).rejects.toThrow(new Error('Color theme "undefined" not found in extensions folder'))
})

test.skip('selectPick - error', async () => {
  expect(
    await QuickPickEntriesColorTheme.selectPick({
      label: 'slime',
    }),
  ).toEqual({
    command: QuickPickReturnValue.Hide,
  })
})

test('getNoResults', () => {
  expect(QuickPickEntriesColorTheme.getNoResults()).toEqual({
    label: 'No matching color themes found',
  })
})
