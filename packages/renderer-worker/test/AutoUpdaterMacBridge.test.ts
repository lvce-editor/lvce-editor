import { beforeEach, expect, jest, test } from '@jest/globals'

const sharedInvoke = jest.fn<(...args: unknown[]) => Promise<unknown>>()
const workerInvoke = jest.fn<(...args: unknown[]) => Promise<unknown>>()
const notify = jest.fn<(...args: unknown[]) => Promise<void>>()
jest.unstable_mockModule('../src/parts/SharedProcess/SharedProcess.js', () => ({ invoke: sharedInvoke }))
jest.unstable_mockModule('../src/parts/UpdateWorker/UpdateWorker.js', () => ({ invoke: workerInvoke }))
jest.unstable_mockModule('../src/parts/Notification/Notification.js', () => ({ create: notify }))
const updater = await import('../src/parts/AutoUpdater/AutoUpdater.js')

beforeEach(() => {
  jest.resetAllMocks()
})

test('forwards platform, staging and restart commands through the shared process', async () => {
  sharedInvoke.mockResolvedValueOnce('darwin')
  await expect(updater.getPlatform()).resolves.toBe('darwin')
  await updater.stageMacUpdate('file:///cache/update.dmg', '0.115.15')
  await updater.restartMacUpdate()
  expect(sharedInvoke.mock.calls).toEqual([
    ['AutoUpdater.getPlatform'],
    ['AutoUpdater.stageMacUpdate', 'file:///cache/update.dmg', '0.115.15'],
    ['AutoUpdater.restartMacUpdate'],
  ])
})

test('shows installation errors returned by the worker, including during automatic checks', async () => {
  workerInvoke.mockResolvedValue({ error: 'checksum mismatch', updated: false })
  await updater.checkForUpdates('start', true)
  expect(notify).toHaveBeenCalledWith('error', 'Failed to install update: checksum mismatch')
})
