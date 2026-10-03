import { afterEach, expect, jest, test } from '@jest/globals'
import * as GetRemoteUrl from '../src/parts/GetRemoteUrl/GetRemoteUrl.js'

jest.unstable_mockModule('../src/parts/Platform/Platform.js', () => ({
  isProduction: false,
}))

jest.unstable_mockModule('../src/parts/Preferences/Preferences.js', () => ({
  getUserPreferences: jest.fn(() => {
    throw new Error('not implemented')
  }),
}))

jest.unstable_mockModule('../src/parts/LinkedWorkerPreferences/LinkedWorkerPreferences.js', () => ({
  getLinkedWorkerPreferences: jest.fn(() => ({})),
}))

const AddCustomPathsToIndexHtml = await import('../src/parts/AddCustomPathsToIndexHtml/AddCustomPathsToIndexHtml.js')
const LinkedWorkerPreferences = await import('../src/parts/LinkedWorkerPreferences/LinkedWorkerPreferences.js')
const Preferences = await import('../src/parts/Preferences/Preferences.js')

const originalArgv = process.argv

afterEach(() => {
  jest.resetAllMocks()
  process.argv = originalArgv
})

test('addCustomPathsToIndexHtml - excludes custom worker paths when disabled from the command line', async () => {
  process.argv = [...originalArgv, '--disable-custom-worker-paths']
  jest.mocked(Preferences.getUserPreferences).mockResolvedValue({
    'develop.editorWorkerPath': '/test/editor-worker',
    'develop.extensionHostWorkerPath': '/test/extension-host-worker',
    'develop.rendererProcessPath': '/test/renderer-process',
  })
  const content =
    '<title>Test</title><script src="/packages/renderer-worker/node_modules/@lvce-editor/renderer-process/dist/rendererProcessMain.js"></script>'
  const rendererProcessUrl = GetRemoteUrl.getRemoteUrl('/test/renderer-process')

  const result = await AddCustomPathsToIndexHtml.addCustomPathsToIndexHtml(content)

  expect(result).toContain(`<script src="${rendererProcessUrl}"></script>`)
  expect(result).toContain(`"rendererProcessPath": "${rendererProcessUrl}"`)
  expect(result).not.toContain('editorWorkerUrl')
  expect(result).not.toContain('extensionHostWorkerUrl')
})

test('addCustomPathsToIndexHtml - adds linked worker urls', async () => {
  jest.mocked(Preferences.getUserPreferences).mockResolvedValue({})
  jest.mocked(LinkedWorkerPreferences.getLinkedWorkerPreferences).mockResolvedValue({
    'develop.mainAreaWorkerPath': '/test/main-area-worker',
  })
  const content = '<title>Test</title>'
  const mainAreaWorkerUrl = GetRemoteUrl.getRemoteUrl('/test/main-area-worker')

  const result = await AddCustomPathsToIndexHtml.addCustomPathsToIndexHtml(content)

  expect(result).toContain(`"develop.mainAreaWorkerPath": "${mainAreaWorkerUrl}"`)
})

test('addCustomPathsToIndexHtml - merges linked worker urls into the existing app config', async () => {
  jest.mocked(Preferences.getUserPreferences).mockResolvedValue({})
  jest.mocked(LinkedWorkerPreferences.getLinkedWorkerPreferences).mockResolvedValue({
    'develop.editorWorkerPath': '/test/editor-worker',
    'develop.mainAreaWorkerPath': '/test/main-area-worker',
  })
  const content =
    '<title>Test</title><script id="Config" type="application/json">{"assetDir":"/editor/1.2.3","platform":"web","rendererWorkerUrl":"/editor/1.2.3/packages/renderer-worker/dist/rendererWorkerMain.js","workerUrls":{"develop.mainAreaWorkerPath":"/old/main-area-worker"}}</script>'
  const mainAreaWorkerUrl = GetRemoteUrl.getRemoteUrl('/test/main-area-worker')

  const result = await AddCustomPathsToIndexHtml.addCustomPathsToIndexHtml(content)
  const configElements = [...result.matchAll(/<script\b[^>]*\bid="Config"[^>]*>([\s\S]*?)<\/script>/g)]

  expect(configElements).toHaveLength(1)
  expect(JSON.parse(configElements[0][1])).toEqual({
    assetDir: '/editor/1.2.3',
    platform: 'web',
    rendererWorkerUrl: '/editor/1.2.3/packages/renderer-worker/dist/rendererWorkerMain.js',
    editorWorkerUrl: GetRemoteUrl.getRemoteUrl('/test/editor-worker'),
    workerUrls: {
      'develop.editorWorkerPath': GetRemoteUrl.getRemoteUrl('/test/editor-worker'),
      'develop.mainAreaWorkerPath': mainAreaWorkerUrl,
    },
  })
})
