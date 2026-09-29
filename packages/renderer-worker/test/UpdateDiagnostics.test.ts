import { beforeEach, expect, jest, test } from '@jest/globals'
import * as diagnostics from '../src/parts/UpdateDiagnostics/UpdateDiagnostics.js'

const invoke = jest.fn<(...args: readonly unknown[]) => Promise<unknown>>()
const writeLog = (message: string): Promise<void> => diagnostics.write(message, invoke)

beforeEach(() => {
  jest.resetAllMocks()
})

test('persists worker actions and returned failures', async () => {
  const result = { error: 'download failed', updated: false }
  await expect(diagnostics.run('Update.checkForUpdates', async () => result, writeLog)).resolves.toBe(result)
  expect(invoke.mock.calls).toEqual([
    ['AutoUpdater.writeLog', 'Update worker: Update.checkForUpdates started'],
    ['AutoUpdater.writeLog', 'Update worker: Update.checkForUpdates failed: download failed'],
  ])
})

test('records RPC failures and propagates the original error', async () => {
  const error = new Error('disk full')
  await expect(
    diagnostics.run(
      'FileSystem.writeBlob',
      async () => {
        throw error
      },
      writeLog,
    ),
  ).rejects.toBe(error)
  expect(invoke.mock.calls[1][1]).toContain('disk full')
})

test('logging failure does not prevent an update action', async () => {
  invoke.mockRejectedValue(new Error('log unavailable'))
  const warn = jest.spyOn(console, 'warn').mockImplementation(() => {})
  try {
    await expect(diagnostics.run('Exec.exec', async () => true, writeLog)).resolves.toBe(true)
  } finally {
    warn.mockRestore()
  }
})
