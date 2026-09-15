import { beforeEach, expect, jest, test } from '@jest/globals'
import * as OnLoadCommands from '../src/parts/OnLoadCommands/OnLoadCommands.js'
import * as PlatformType from '../src/parts/PlatformType/PlatformType.js'
import * as PreferencesState from '../src/parts/PreferencesState/PreferencesState.js'

beforeEach(() => {
  PreferencesState.setAll({})
})

test.each([undefined, false, 'true'])('run skips a missing on-load file when the setting is %p', async (value) => {
  PreferencesState.set('application.useOnLoadJson', value)
  const executeCommand = jest.fn<(...parameters: readonly unknown[]) => Promise<void>>(async () => {})
  const getJson = jest.fn<(url: string) => Promise<readonly unknown[]>>(async () => {
    throw new Error('Failed to request json: 404 Not Found')
  })

  await OnLoadCommands.run('/video-preview/55af9e7', PlatformType.Web, { executeCommand, getJson })

  expect(getJson).not.toHaveBeenCalled()
  expect(executeCommand).not.toHaveBeenCalled()
})

test('run executes configured extension commands in order', async () => {
  PreferencesState.set('application.useOnLoadJson', true)
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
  PreferencesState.set('application.useOnLoadJson', true)
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
