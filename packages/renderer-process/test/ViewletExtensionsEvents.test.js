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

const ViewletExtensions = await import(
  '../src/parts/ViewletExtensions/ViewletExtensions.js'
)

const RendererWorker = await import(
  '../src/parts/RendererWorker/RendererWorker.js'
)

beforeEach(() => {
  jest.restoreAllMocks()
})

test('event -  input', () => {
  const state = ViewletExtensions.create()
  // @ts-ignore
  RendererWorker.send.mockImplementation(() => {})
  const { $InputBox } = state
  $InputBox.value = 'abc'
  $InputBox.dispatchEvent(
    new InputEvent('input', {
      bubbles: true,
      cancelable: true,
    })
  )
  expect(RendererWorker.send).toHaveBeenCalledTimes(1)
  expect(RendererWorker.send).toHaveBeenCalledWith(
    'Extensions.handleInput',
    'abc'
  )
  ViewletExtensions.setExtensions(state, [])
})

// TODO
test.skip('user clicks install', () => {
  const state = ViewletExtensions.create()
  // @ts-ignore
  RendererWorker.send.mockImplementation(() => {})
  ViewletExtensions.setExtensions(state, [
    {
      id: 'test-author.test=extension-1',
      name: 'Test Extension 1',
      state: 'uninstalled',
    },
  ])
  state.$Extensions.children[0]
    // @ts-ignore
    .querySelector('.ExtensionManage')
    .dispatchEvent(
      new Event('click', {
        bubbles: true,
        cancelable: true,
      })
    )
  expect(RendererWorker.send).toHaveBeenCalledWith([
    1,
    2133,
    'Extensions',
    'handleInstall',
    'test-author.test=extension-1',
  ])
})

test.skip('user clicks while installing', () => {
  const state = ViewletExtensions.create()
  // @ts-ignore
  RendererWorker.send.mockImplementation(() => {})
  ViewletExtensions.setExtensions(state, [
    {
      id: 'test-author.test=extension-1',
      name: 'Test Extension 1',
      state: 'installing',
    },
  ])
  state.$Extensions.children[0]
    // @ts-ignore
    .querySelector('.ExtensionManage')
    .dispatchEvent(
      new Event('click', {
        bubbles: true,
        cancelable: true,
      })
    )
  expect(RendererWorker.send).not.toHaveBeenCalled()
})

test.skip('event - click - somewhere else', () => {
  const state = ViewletExtensions.create()
  // @ts-ignore
  RendererWorker.send.mockImplementation(() => {})
  ViewletExtensions.setExtensions(state, [
    {
      id: 'test-author.test=extension-1',
      name: 'Test Extension 1',
      state: 'uninstalled',
    },
  ])
  state.$Extensions.children[0].dispatchEvent(
    new Event('click', {
      bubbles: true,
      cancelable: true,
    })
  )
  expect(RendererWorker.send).toHaveBeenCalledWith([
    867,
    'test-author.test=extension-1',
  ])
})

// TODO
test.skip('user clicks uninstall', () => {
  const state = ViewletExtensions.create()
  // @ts-ignore
  RendererWorker.send.mockImplementation(() => {})
  ViewletExtensions.setExtensions(state, [
    {
      id: 'test-author.test-extension-1',
      name: 'Test Extension 1',
      state: 'installed',
    },
  ])
  state.$Extensions.children[0]
    // @ts-ignore
    .querySelector('.ExtensionManage')
    .dispatchEvent(
      new Event('click', {
        bubbles: true,
        cancelable: true,
      })
    )
  expect(RendererWorker.send).toHaveBeenCalledWith([
    1,
    2133,
    'Extensions',
    'handleUninstall',
    'test-author.test-extension-1',
  ])
})

test('icon - error', () => {
  const state = ViewletExtensions.create()
  ViewletExtensions.setExtensions(state, [
    {
      name: 'Test Extension 1',
      publisher: 'Test Author',
      icon: '/not-found.png',
    },
  ])
  const $ExtensionList = state.$ExtensionList
  const $FirstExtension = $ExtensionList.children[0]
  const $FirstIcon = $FirstExtension.querySelector('.ExtensionIcon')
  // @ts-ignore
  expect($FirstIcon.src).toBe('http://localhost/not-found.png')
  $FirstIcon.dispatchEvent(new ErrorEvent('error', { bubbles: true }))
  // @ts-ignore
  expect($FirstIcon.src).toBe('http://localhost/icons/extensionDefaultIcon.png')
})

test('icon - error - endless loop bug', () => {
  const state = ViewletExtensions.create()
  ViewletExtensions.setExtensions(state, [
    {
      name: 'Test Extension 1',
      publisher: 'Test Author',
      icon: '/not-found.png',
    },
  ])
  const $ExtensionList = state.$ExtensionList
  const $FirstExtension = $ExtensionList.children[0]
  // @ts-ignore
  const $FirstIcon = $FirstExtension.querySelector('.ExtensionIcon')
  // @ts-ignore
  const spy = jest.spyOn($FirstIcon, 'src', 'set')
  // @ts-ignore
  expect($FirstIcon.src).toBe('http://localhost/not-found.png')
  $FirstIcon.dispatchEvent(new ErrorEvent('error', { bubbles: true }))
  expect(spy).toHaveBeenCalledTimes(1)
  // @ts-ignore
  expect($FirstIcon.src).toBe('http://localhost/icons/extensionDefaultIcon.png')
  $FirstIcon.dispatchEvent(new ErrorEvent('error', { bubbles: true }))
  // @ts-ignore
  expect($FirstIcon.src).toBe('http://localhost/icons/extensionDefaultIcon.png')
  expect(spy).toHaveBeenCalledTimes(1)
})
