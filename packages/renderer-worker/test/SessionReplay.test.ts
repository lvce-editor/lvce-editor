import { expect, jest, test } from '@jest/globals'

const invoke = jest.fn<(...args: readonly unknown[]) => Promise<unknown>>()
const execute = jest.fn<any>()
const get = jest.fn<any>()
jest.unstable_mockModule('../src/parts/RendererProcess/RendererProcess.js', () => ({ invoke }))
jest.unstable_mockModule('../src/parts/Command/Command.js', () => ({ execute }))
jest.unstable_mockModule('../src/parts/Location/Location.js', () => ({
  getHref: () => 'https://lvce-editor.dev/?allowAnonymous=true&folder=test#token',
}))
jest.unstable_mockModule('../src/parts/Preferences/Preferences.js', () => ({ get }))
jest.unstable_mockModule('../src/parts/Product/Product.js', () => ({ getBackendUrl: () => 'https://backend.example' }))
const SessionReplay = await import('../src/parts/SessionReplay/SessionReplay.js')

test('local recording and upload have independent settings', async () => {
  get.mockImplementation((key) => key === 'sessionReplay.uploadEnabled')
  invoke.mockResolvedValue('session-id')
  await SessionReplay.startRecording({ accessToken: 'test-token' })
  expect(invoke).toHaveBeenCalledWith('SessionReplay.configure', {
    local: false,
    upload: true,
    endpoint: 'https://backend.example/session-replay?allowAnonymous=true',
    token: 'test-token',
  })
})

test('download exports the versioned worker recording', async () => {
  const session = { version: 1, id: 'test', events: [] }
  invoke.mockResolvedValue(session)
  await SessionReplay.downloadSession()
  expect(execute).toHaveBeenCalledWith('Download.downloadJson', session, 'test.json')
})

test('replay link drops original workspace and authentication parameters', async () => {
  await SessionReplay.replaySession('test-id')
  expect(execute).toHaveBeenCalledWith('Open.openUrl', 'https://lvce-editor.dev/?replayId=test-id')
})

test('file replay opens a separate replay layout', async () => {
  await SessionReplay.openSession()
  expect(execute).toHaveBeenCalledWith('Open.openUrl', 'https://lvce-editor.dev/?sessionReplay=true')
})
