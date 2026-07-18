import { afterEach, expect, jest, test } from '@jest/globals'

jest.unstable_mockModule('../src/parts/Platform/Platform.js', () => ({
  isProduction: false,
}))

jest.unstable_mockModule('../src/parts/Preferences/Preferences.js', () => ({
  getUserPreferences: jest.fn(() => {
    throw new Error('not implemented')
  }),
}))

const AddCustomPathsToIndexHtml = await import('../src/parts/AddCustomPathsToIndexHtml/AddCustomPathsToIndexHtml.js')
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

  const result = await AddCustomPathsToIndexHtml.addCustomPathsToIndexHtml(content)

  expect(result).toContain('<script src="/remote/test/renderer-process"></script>')
  expect(result).toContain('"rendererProcessPath": "/remote/test/renderer-process"')
  expect(result).not.toContain('editorWorkerUrl')
  expect(result).not.toContain('extensionHostWorkerUrl')
})
