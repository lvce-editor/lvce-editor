import { beforeEach, expect, jest, test } from '@jest/globals'
import { dirname, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

jest.unstable_mockModule('../src/parts/GetAppWindowOptions/GetAppWindowOptions.js', () => ({
  getAppWindowOptions: jest.fn(() => ({})),
}))

jest.unstable_mockModule('../src/parts/GetTitleBarItems/GetTitleBarItems.js', () => ({
  getTitleBarItems: jest.fn(() => []),
}))

jest.unstable_mockModule('../src/parts/MainProcess/MainProcess.js', () => ({
  invoke: jest.fn(() => {}),
}))

jest.unstable_mockModule('../src/parts/Preferences/Preferences.js', () => ({
  getAll: jest.fn(() => ({})),
}))

jest.unstable_mockModule('../src/parts/PreloadUrl/PreloadUrl.js', () => ({
  getPreloadUrl: jest.fn(() => 'file:///preload.js'),
}))

jest.unstable_mockModule('../src/parts/Screen/Screen.js', () => ({
  getBounds: jest.fn(() => ({ height: 1080, width: 1920 })),
}))

const AppWindow = await import('../src/parts/AppWindow/AppWindow.js')
const ParentIpc = await import('../src/parts/MainProcess/MainProcess.js')

const otherPath = resolve('test', 'other')
const workspacePath = resolve('test', 'workspace')
const workspaceUri = pathToFileURL(workspacePath).toString()

beforeEach(() => {
  jest.clearAllMocks()
})

test('openNew with trusted app url', async () => {
  await AppWindow.openNew('lvce-oss://-/?test=1')

  expect(ParentIpc.invoke).toHaveBeenCalledTimes(1)
  expect(ParentIpc.invoke).toHaveBeenCalledWith('AppWindow.createAppWindow', {}, [], '', [], 'lvce-oss://-/?test=1')
})

test('openNew with relative app url', async () => {
  await AppWindow.openNew('/tests/example.html')

  expect(ParentIpc.invoke).toHaveBeenCalledTimes(1)
  expect(ParentIpc.invoke).toHaveBeenCalledWith('AppWindow.createAppWindow', {}, [], '', [], 'lvce-oss://-/tests/example.html')
})

test.each(['https://example.com', 'file:///tmp/index.html', 'javascript:alert(1)', 'lvce-oss://example.com/', 'lvce-oss://user@-/'])(
  'openNew rejects untrusted url %s',
  async (url) => {
    await expect(AppWindow.openNew(url)).rejects.toThrow(new TypeError('Only application URLs can be opened in an app window'))
    expect(ParentIpc.invoke).not.toHaveBeenCalled()
  },
)

test('openNew rejects non-string url', async () => {
  await expect(AppWindow.openNew({})).rejects.toThrow(new TypeError('Expected url to be a string'))
  expect(ParentIpc.invoke).not.toHaveBeenCalled()
})

test('openNewWithUri', async () => {
  await AppWindow.openNewWithUri('/workspace/file.txt')

  expect(ParentIpc.invoke).toHaveBeenCalledTimes(1)
  expect(ParentIpc.invoke).toHaveBeenCalledWith('AppWindow.createAppWindow', {}, [], '', [], 'lvce-oss://-/?openUri=%2Fworkspace%2Ffile.txt')
})

test.each([
  ['dot path', '.', workspacePath, workspaceUri],
  ['relative path', 'folder', workspacePath, pathToFileURL(resolve(workspacePath, 'folder')).toString()],
  ['absolute path', workspacePath, otherPath, workspaceUri],
  ['file url', workspaceUri, otherPath, workspaceUri],
])('createAppWindow adds workspace from %s', async (_name, argument, workingDirectory, expectedWorkspaceUri) => {
  const url = new URL('lvce-oss://-/')
  url.searchParams.set('workspace', expectedWorkspaceUri)
  const parsedArgs = { _: [argument] }

  await AppWindow.createAppWindow({
    parsedArgs,
    preferences: {},
    preloadUrl: 'file:///preload.js',
    workingDirectory,
  })

  expect(ParentIpc.invoke).toHaveBeenCalledTimes(1)
  expect(ParentIpc.invoke).toHaveBeenCalledWith('AppWindow.createAppWindow', {}, parsedArgs, workingDirectory, [], url.toString())
})

test('createAppWindow opens a file argument in its parent workspace', async () => {
  const filePath = fileURLToPath(import.meta.url)
  const fileUri = pathToFileURL(filePath).toString()
  const workspaceUri = pathToFileURL(dirname(filePath)).toString()
  const url = new URL('lvce-oss://-/')
  url.searchParams.set('workspace', workspaceUri)
  url.searchParams.set('openUri', fileUri)
  const parsedArgs = { _: [filePath] }

  await AppWindow.createAppWindow({
    parsedArgs,
    preferences: {},
    preloadUrl: 'file:///preload.js',
    workingDirectory: otherPath,
  })

  expect(ParentIpc.invoke).toHaveBeenCalledTimes(1)
  expect(ParentIpc.invoke).toHaveBeenCalledWith('AppWindow.createAppWindow', {}, parsedArgs, otherPath, [], url.toString())
})
