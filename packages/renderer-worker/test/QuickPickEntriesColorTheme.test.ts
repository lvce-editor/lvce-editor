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
const execute = jest.fn()
jest.unstable_mockModule('../src/parts/Command/Command.js', () => ({ execute }))
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

test('selectPick applies the selected theme and hides the quickpick', async () => {
  await expect(QuickPickEntriesColorTheme.selectPick('slime')).resolves.toEqual({
    command: QuickPickReturnValue.Hide,
  })
  expect(execute).toHaveBeenCalledWith('ColorTheme.setColorTheme', 'slime')
})

test('focusPick applies the previewed theme', async () => {
  await QuickPickEntriesColorTheme.focusPick('cobalt2')

  expect(execute).toHaveBeenCalledWith('ColorTheme.setColorTheme', 'cobalt2')
})

test('getNoResults', () => {
  expect(QuickPickEntriesColorTheme.getNoResults()).toEqual({
    label: 'No matching color themes found',
  })
})
