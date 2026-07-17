import { beforeEach, expect, jest, test } from '@jest/globals'
import * as AutoUpdater from '../src/parts/AutoUpdater/AutoUpdater.js'

const dependencies = {
  getLatestVersion: jest.fn<() => Promise<{ readonly version: string } | undefined>>(),
  notify: jest.fn<(type: string, message: string) => Promise<void>>(),
  startUpdate: jest.fn<(updateSetting: string | undefined, repository: string) => Promise<void>>(),
}

beforeEach(() => {
  jest.resetAllMocks()
})

test('reports when the current version is up to date', async () => {
  dependencies.getLatestVersion.mockResolvedValue(undefined)

  await AutoUpdater.checkForUpdatesWithDependencies(undefined, false, dependencies)

  expect(dependencies.notify).toHaveBeenNthCalledWith(1, 'info', 'Checking for updates...')
  expect(dependencies.notify).toHaveBeenNthCalledWith(2, 'info', 'You are using the latest version.')
  expect(dependencies.startUpdate).not.toHaveBeenCalled()
})

test('reports an available update and starts the updater', async () => {
  dependencies.getLatestVersion.mockResolvedValue({
    version: '1.2.3',
  })

  await AutoUpdater.checkForUpdatesWithDependencies(undefined, false, dependencies)

  expect(dependencies.notify).toHaveBeenNthCalledWith(1, 'info', 'Checking for updates...')
  expect(dependencies.notify).toHaveBeenNthCalledWith(2, 'info', 'Update 1.2.3 is available.')
  expect(dependencies.startUpdate).toHaveBeenCalledWith(undefined, 'lvce-editor/lvce-editor')
})

test('reports update check errors', async () => {
  dependencies.getLatestVersion.mockRejectedValue(new Error('network unavailable'))

  await AutoUpdater.checkForUpdatesWithDependencies(undefined, false, dependencies)

  expect(dependencies.notify).toHaveBeenNthCalledWith(1, 'info', 'Checking for updates...')
  expect(dependencies.notify).toHaveBeenNthCalledWith(2, 'error', 'Failed to check for updates: network unavailable')
  expect(dependencies.startUpdate).not.toHaveBeenCalled()
})

test('keeps automatic update checks silent', async () => {
  await AutoUpdater.checkForUpdatesWithDependencies('start', true, dependencies)

  expect(dependencies.getLatestVersion).not.toHaveBeenCalled()
  expect(dependencies.notify).not.toHaveBeenCalled()
  expect(dependencies.startUpdate).toHaveBeenCalledWith('start', 'lvce-editor/lvce-editor')
})
