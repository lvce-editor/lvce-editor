import { afterEach, expect, jest, test } from '@jest/globals'
import * as GetRemoteUrl from '../src/parts/GetRemoteUrl/GetRemoteUrl.js'

const configElementPattern = /<script\b[^>]*\bid="Config"[^>]*>([\s\S]*?)<\/script>/g
const workerUrlsPattern = /\n\s+"workerUrls": \{\n\s+"develop\./
const formattedConfigPattern = /<script id="Config" type="application\/json">\n\s{6}\{\n\s{8}"assetDir"/

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
    '<title>Test</title>\n    <script id="Config" type="application/json">{"assetDir":"/editor/1.2.3","platform":"web","rendererWorkerUrl":"/editor/1.2.3/packages/renderer-worker/dist/rendererWorkerMain.js","html":"\\u003c/script\\u003e\\u003cscript>alert(1)\\u003c/script\\u003e","workerUrls":{"develop.mainAreaWorkerPath":"/old/main-area-worker"}}</script>'
  const mainAreaWorkerUrl = GetRemoteUrl.getRemoteUrl('/test/main-area-worker')

  const result = await AddCustomPathsToIndexHtml.addCustomPathsToIndexHtml(content)
  const configElements = [...result.matchAll(configElementPattern)]

  expect(configElements).toHaveLength(1)
  expect(result).toMatch(formattedConfigPattern)
  expect(result).toContain('\n      }\n    </script>')
  expect(configElements[0][1]).toMatch(workerUrlsPattern)
  expect(configElements[0][1]).toContain('\\u003c/script\\u003e\\u003cscript\\u003ealert(1)\\u003c/script\\u003e')
  expect(result).not.toContain('</script><script>alert(1)</script>')
  expect(JSON.parse(configElements[0][1])).toEqual({
    assetDir: '/editor/1.2.3',
    editorWorkerUrl: GetRemoteUrl.getRemoteUrl('/test/editor-worker'),
    html: '</script><script>alert(1)</script>',
    platform: 'web',
    rendererWorkerUrl: '/editor/1.2.3/packages/renderer-worker/dist/rendererWorkerMain.js',
    workerUrls: {
      'develop.editorWorkerPath': GetRemoteUrl.getRemoteUrl('/test/editor-worker'),
      'develop.mainAreaWorkerPath': mainAreaWorkerUrl,
    },
  })
})

test('addCustomPathsToIndexHtml - Electron runtime overrides the shared web config', async () => {
  jest.mocked(Preferences.getUserPreferences).mockResolvedValue({})
  jest.mocked(LinkedWorkerPreferences.getLinkedWorkerPreferences).mockResolvedValue({})
  const content = '<title>Test</title><script id="Config" type="application/json">{"assetDir":"","platform":"web","workerUrls":{}}</script>'
  const result = await AddCustomPathsToIndexHtml.addCustomPathsToIndexHtml(content, { platform: 'electron' })
  const configElements = [...result.matchAll(configElementPattern)]
  expect(configElements).toHaveLength(1)
  expect(JSON.parse(configElements[0][1])).toEqual({ assetDir: '', platform: 'electron', workerUrls: {} })
})

test('addCustomPathsToIndexHtml - merges and safely serializes the Electron workspace URI', async () => {
  jest.mocked(Preferences.getUserPreferences).mockResolvedValue({})
  jest.mocked(LinkedWorkerPreferences.getLinkedWorkerPreferences).mockResolvedValue({})
  const content = '<title>Test</title><script id="Config" type="application/json">{"platform":"web","workerUrls":{}}</script>'
  const workspaceUri = 'remote-ssh://user@example.com/home/project?name=<script>&'
  const result = await AddCustomPathsToIndexHtml.addCustomPathsToIndexHtml(content, { platform: 'electron', workspaceUri })
  const configElement = [...result.matchAll(configElementPattern)][0]

  expect(result).toContain('"workspaceUri": "remote-ssh://user@example.com/home/project?name=\\u003cscript\\u003e\\u0026"')
  expect(JSON.parse(configElement[1])).toMatchObject({ platform: 'electron', workerUrls: {}, workspaceUri })
})
