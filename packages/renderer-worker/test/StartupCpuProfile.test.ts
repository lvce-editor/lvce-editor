import { beforeEach, expect, jest, test } from '@jest/globals'

jest.unstable_mockModule('../src/parts/EditorWorker/EditorWorker.ts', () => ({ invoke: jest.fn() }))
jest.unstable_mockModule('../src/parts/GetActiveEditor/GetActiveEditor.js', () => ({ getActiveEditorId: jest.fn(() => 42) }))
jest.unstable_mockModule('../src/parts/SharedProcess/SharedProcess.js', () => ({ invoke: jest.fn() }))

const EditorWorker = await import('../src/parts/EditorWorker/EditorWorker.ts')
const SharedProcess = await import('../src/parts/SharedProcess/SharedProcess.js')
const Profile = await import('../src/parts/StartupCpuProfile/StartupCpuProfile.js')

beforeEach(() => {
  jest.clearAllMocks()
})

test('does not stop capture before diagnostics finish', async () => {
  const pass = Promise.withResolvers<void>()
  ;(EditorWorker.invoke as any).mockImplementationOnce(() => pass.promise)
  const completion = Profile.complete()
  expect(EditorWorker.invoke).toHaveBeenCalledWith('Editor.waitForDiagnostics', 42)
  expect(SharedProcess.invoke).not.toHaveBeenCalled()
  pass.resolve()
  await completion
  expect(SharedProcess.invoke).toHaveBeenCalledWith('StartupCpuProfile.complete', '')
})

test('flushes capture with a failure when diagnostics fail', async () => {
  ;(EditorWorker.invoke as any).mockRejectedValueOnce(new Error('provider failed'))
  await Profile.complete()
  expect(SharedProcess.invoke).toHaveBeenCalledWith('StartupCpuProfile.complete', 'Error: provider failed')
})
