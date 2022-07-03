import { jest } from '@jest/globals'

jest.unstable_mockModule(
  '../src/parts/RendererProcess/RendererProcess.js',
  () => {
    return {
      invoke: jest.fn(() => {
        throw new Error('not implemented')
      }),
    }
  }
)

const Location = await import('../src/parts/Location/Location.js')
const RendererProcess = await import(
  '../src/parts/RendererProcess/RendererProcess.js'
)

afterEach(() => {
  jest.resetAllMocks()
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
  expect(RendererProcess.invoke).toHaveBeenCalledWith(
    'Location.getHref',
    'http://localhost:3000/test-path'
  )
})

test('setPathName', async () => {
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  await Location.setPathName('/')
  expect(RendererProcess.invoke).toHaveBeenCalledTimes(1)
  expect(RendererProcess.invoke).toHaveBeenCalledWith(
    'Location.setPathName',
    '/'
  )
})
