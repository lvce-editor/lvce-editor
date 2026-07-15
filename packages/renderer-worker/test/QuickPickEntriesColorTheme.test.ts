import { beforeEach, expect, jest, test } from '@jest/globals'
import * as PlatformType from '../src/parts/PlatformType/PlatformType.js'
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
jest.unstable_mockModule('../src/parts/ExtensionManagementWorker/ExtensionManagementWorker.js', () => {
  return {
    invoke: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})

const QuickPickEntriesColorTheme = await import('../src/parts/QuickPickEntriesColorTheme/QuickPickEntriesColorTheme.js')
const ExtensionManagementWorker = await import('../src/parts/ExtensionManagementWorker/ExtensionManagementWorker.js')

test('getPlaceholder', () => {
  expect(QuickPickEntriesColorTheme.getPlaceholder()).toBe('Select Color Theme')
})

test('getPicks', async () => {
  // @ts-ignore
  ExtensionManagementWorker.invoke.mockImplementation((method, assetDir, platform) => {
    expect(assetDir).toBe('')
    expect(platform).toBe(PlatformType.Test)
    switch (method) {
      case 'Extensions.getColorThemeNames':
        return ['monokai', 'shades-of-purple', 'slime']
      default:
        throw new Error('unexpected message')
    }
  })
  expect(await QuickPickEntriesColorTheme.getPicks()).toEqual(['monokai', 'shades-of-purple', 'slime'])
})

test('getPicks - error', async () => {
  const error = new Error('Failed to get color theme names')
  // @ts-ignore
  ExtensionManagementWorker.invoke.mockRejectedValue(error)
  await expect(QuickPickEntriesColorTheme.getPicks()).rejects.toThrow(error)
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
