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

const ExtensionHostCommands = await import('../src/parts/ExtensionHost/ExtensionHostCommands.js')

test('omits internal and disabled extension commands from the command palette', async () => {
  await expect(ExtensionHostCommands.getCommands('', 1)).resolves.toEqual([{ id: 'sample.visible', label: 'Sample: Visible' }])
})
