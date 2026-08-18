import { expect, jest, test } from '@jest/globals'
import * as OnLoadCommands from '../src/parts/OnLoadCommands/OnLoadCommands.js'
import * as PlatformType from '../src/parts/PlatformType/PlatformType.js'

test('run executes configured extension commands in order', async () => {
  const executeCommand = jest.fn<(...parameters: readonly unknown[]) => Promise<void>>(async () => {})
  const getJson = jest.fn<(url: string) => Promise<readonly unknown[]>>(async () => {
    return [
      {
        args: ['first'],
        command: 'Sample.setup',
        name: 'Setup sample',
      },
      {
        command: 'Sample.open',
        name: 'Open sample',
      },
    ]
  })

  await OnLoadCommands.run('/assets', PlatformType.Web, { executeCommand, getJson })

  expect(getJson).toHaveBeenCalledWith('/assets/config/onLoadCommands.json')
  expect(executeCommand).toHaveBeenNthCalledWith(1, 'ExtensionHost.executeCommand', 'Sample.setup', 'first')
  expect(executeCommand).toHaveBeenNthCalledWith(2, 'ExtensionHost.executeCommand', 'Sample.open')
})

test('run does nothing outside the web platform', async () => {
  const executeCommand = jest.fn<(...parameters: readonly unknown[]) => Promise<void>>(async () => {})
  const getJson = jest.fn<(url: string) => Promise<readonly unknown[]>>(async () => [])

  await OnLoadCommands.run('/assets', PlatformType.Electron, { executeCommand, getJson })

  expect(getJson).not.toHaveBeenCalled()
  expect(executeCommand).not.toHaveBeenCalled()
})

test('executeOnLoadCommands rejects invalid arguments', async () => {
  await expect(
    OnLoadCommands.executeOnLoadCommands([
      {
        args: 'invalid',
        command: 'Sample.setup',
      },
    ]),
  ).rejects.toThrow(new TypeError('on-load command arguments for Sample.setup must be an array'))
})
