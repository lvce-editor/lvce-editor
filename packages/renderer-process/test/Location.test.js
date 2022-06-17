/**
 * @jest-environment jsdom
 */
import * as Location from '../src/parts/Location/Location.js'
import { jest } from '@jest/globals'
import * as RendererWorker from '../src/parts/RendererWorker/RendererWorker.js'

afterEach(() => {
  jest.restoreAllMocks()
})

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

test('hydrate', () => {
  RendererWorker.state.send = jest.fn()
  Location.hydrate()
  window.dispatchEvent(new PopStateEvent('popstate'))
  expect(RendererWorker.state.send).toHaveBeenCalledTimes(1)
  expect(RendererWorker.state.send).toHaveBeenCalledWith([7634])
})
