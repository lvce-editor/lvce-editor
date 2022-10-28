/**
 * @jest-environment jsdom
 */
import { jest } from '@jest/globals'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule(
  '../src/parts/RendererWorker/RendererWorker.js',
  () => {
    return {
      send: jest.fn(() => {
        throw new Error('not implemented')
      }),
    }
  }
)

const RendererWorker = await import(
  '../src/parts/RendererWorker/RendererWorker.js'
)

const Location = await import('../src/parts/Location/Location.js')

test('getPathName', () => {
  expect(Location.getPathName()).toBe('/')
})

test('setPathName', () => {
  const spy = jest.spyOn(history, 'pushState').mockImplementation(() => {})
  Location.setPathName('/test')
  expect(spy).toHaveBeenCalledTimes(1)
  expect(spy).toHaveBeenCalledWith(null, null, '/test')
})

test('setPathName - should do nothing if we are already at the url', () => {
  delete window.location
  // @ts-ignore
  window.location = { pathname: '/test' }
  const spy = jest.spyOn(history, 'pushState').mockImplementation(() => {})
  Location.setPathName('/test')
  expect(spy).not.toHaveBeenCalled()
})

test.skip('hydrate', () => {
  // TODO mock instead
  // @ts-ignore
  RendererWorker.send.mockImplementation(() => {})
  Location.hydrate()
  window.dispatchEvent(new PopStateEvent('popstate'))
  expect(RendererWorker.send).toHaveBeenCalledTimes(1)
  expect(RendererWorker.send).toHaveBeenCalledWith('Workspace.hydrate')
})

test.skip('getHref', () => {
  expect(Location.getHref()).toBe('/')
})
