import { expect, jest, test } from '@jest/globals'

const getExtensions = jest.fn(async () => [
  {
    commands: [
      { id: 'sample.visible', label: 'Sample: Visible' },
      { id: 'sample.internal', internal: true },
    ],
  },
  {
    commands: [{ id: 'sample.disabled', label: 'Sample: Disabled' }],
    disabled: true,
  },
])

jest.unstable_mockModule('../src/parts/ExtensionMeta/ExtensionMeta.js', () => ({
  getExtensions,
}))

const invoke = jest
  .fn<(...args: readonly any[]) => Promise<any>>()
  .mockResolvedValue([{ commands: [{ id: 'source.command', label: 'Source Command' }] }])
jest.unstable_mockModule('../src/parts/ExtensionManagementWorker/ExtensionManagementWorker.js', () => ({ invoke }))

const ExtensionHostCommands = await import('../src/parts/ExtensionHost/ExtensionHostCommands.js')

test('omits internal and disabled extension commands from the command palette', async () => {
  await expect(ExtensionHostCommands.getCommands('', 1)).resolves.toEqual([{ id: 'sample.visible', label: 'Sample: Visible' }])
})

test('queries only the requested application for extension commands', async () => {
  await expect(ExtensionHostCommands.getCommands('/static', 1, 'source')).resolves.toEqual([{ id: 'source.command', label: 'Source Command' }])
  expect(invoke).toHaveBeenCalledWith('Extensions.invokeForApplication', 'source', 'Extensions.getAllExtensions', '/static', 1)
})
