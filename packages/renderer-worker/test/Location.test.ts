import { afterEach, expect, jest, test } from '@jest/globals'

jest.unstable_mockModule('../src/parts/RendererProcess/RendererProcess.js', () => {
  return {
    invoke: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})

const Location = await import('../src/parts/Location/Location.js')
const RendererProcess = await import('../src/parts/RendererProcess/RendererProcess.js')

afterEach(() => {
  jest.resetAllMocks()
  Location.initialize('')
})

test('getPathName', async () => {
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {
    return '/test-path'
  })
  expect(await Location.getPathName()).toBe('/test-path')
})

test('getHref', async () => {
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {
    return 'http://localhost:3000/test-path'
  })
  expect(await Location.getHref()).toBe('http://localhost:3000/test-path')
  expect(RendererProcess.invoke).toHaveBeenCalledTimes(1)
  expect(RendererProcess.invoke).toHaveBeenCalledWith('Location.getHref')
})

test('setPathName', async () => {
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  Location.initialize('http://localhost:3000/test-path')
  await Location.setPathName('/')
  expect(RendererProcess.invoke).toHaveBeenCalledTimes(1)
  expect(RendererProcess.invoke).toHaveBeenCalledWith('Location.setPathName', '/')
})

test('setPathName - does not invoke renderer process when resolved pathname is unchanged', async () => {
  Location.initialize('http://localhost:3000/tests/activity-bar.html?test=activity-bar#test')

  await Location.setPathName('')

  expect(RendererProcess.invoke).not.toHaveBeenCalled()
})

test('setPathName - invokes renderer process only once for repeated pathname', async () => {
  // @ts-ignore
  RendererProcess.invoke.mockResolvedValue(undefined)
  Location.initialize('http://localhost:3000/')

  await Location.setPathName('/github/lvce-editor/lvce-editor')
  await Location.setPathName('/github/lvce-editor/lvce-editor')

  expect(RendererProcess.invoke).toHaveBeenCalledTimes(1)
  expect(RendererProcess.invoke).toHaveBeenCalledWith('Location.setPathName', '/github/lvce-editor/lvce-editor')
})

test('setPathName - resolves relative pathnames against the latest pathname', async () => {
  // @ts-ignore
  RendererProcess.invoke.mockResolvedValue(undefined)
  Location.initialize('http://localhost:3000/github/lvce-editor/lvce-editor?test=1#test')

  await Location.setPathName('./vscode')
  await Location.setPathName('/github/lvce-editor/vscode')

  expect(RendererProcess.invoke).toHaveBeenCalledTimes(1)
  expect(RendererProcess.invoke).toHaveBeenCalledWith('Location.setPathName', './vscode')
})

test('setPathName - preserves query and hash when the pathname is unchanged', async () => {
  Location.initialize('http://localhost:3000/callback?code=123#auth')

  await Location.setPathName('/callback')

  expect(RendererProcess.invoke).not.toHaveBeenCalled()
})

test('setPathName - falls back to renderer process before initialization', async () => {
  // @ts-ignore
  RendererProcess.invoke.mockResolvedValue(undefined)

  await Location.setPathName('/')

  expect(RendererProcess.invoke).toHaveBeenCalledTimes(1)
  expect(RendererProcess.invoke).toHaveBeenCalledWith('Location.setPathName', '/')
})
