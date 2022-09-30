/**
 * @jest-environment jsdom
 */
import { jest } from '@jest/globals'

beforeAll(() => {
  // workaround for jsdom not supporting pointer events
  // @ts-ignore
  globalThis.PointerEvent = class extends Event {
    constructor(type, init) {
      super(type, init)
      this.clientX = init.clientX
      this.clientY = init.clientY
      this.pointerId = init.pointerId
      this.button = init.button
    }
  }
  Object.defineProperty(HTMLElement.prototype, 'onpointerdown', {
    set(fn) {
      this.addEventListener('pointerdown', fn)
    },
  })
  Object.defineProperty(HTMLElement.prototype, 'onpointerup', {
    set(fn) {
      this.addEventListener('pointerup', fn)
    },
  })
})

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule(
  '../src/parts/RendererWorker/RendererWorker.js',
  () => {
    return {
      send: jest.fn(),
    }
  }
)

const ViewletExtensions = await import(
  '../src/parts/ViewletExtensions/ViewletExtensions.js'
)

const RendererWorker = await import(
  '../src/parts/RendererWorker/RendererWorker.js'
)

beforeAll(() => {
  // workaround for jsdom not supporting Touch constructor
  // @ts-ignore
  globalThis.Touch = class {
    constructor(init) {
      this.clientX = init.clientX
      this.clientY = init.clientY
      this.identifier = init.identifier
    }
  }
})

beforeEach(() => {
  jest.restoreAllMocks()
})

test('event -  input', () => {
  const state = ViewletExtensions.create()
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
test.skip('event - click on install', () => {
  const state = ViewletExtensions.create()
  ViewletExtensions.setExtensions(state, [
    {
      id: 'test-author.test=extension-1',
      name: 'Test Extension 1',
      state: 'uninstalled',
    },
  ])
  const { $ExtensionList } = state
  console.log($ExtensionList.innerHTML)
  $ExtensionList.children[0]
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

test('event - click - on extension', () => {
  const state = ViewletExtensions.create()
  ViewletExtensions.setExtensions(state, [
    {
      id: 'test-author.test=extension-1',
      name: 'Test Extension 1',
      state: 'uninstalled',
    },
  ])
  const { $ExtensionList } = state
  $ExtensionList.children[0].dispatchEvent(
    new PointerEvent('pointerdown', {
      bubbles: true,
      cancelable: true,
    })
  )
  expect(RendererWorker.send).toHaveBeenCalledTimes(1)
  expect(RendererWorker.send).toHaveBeenCalledWith('Extensions.handleClick', 0)
})

// TODO
test.skip('user clicks uninstall', () => {
  const state = ViewletExtensions.create()
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

test('event - touchstart', () => {
  const state = ViewletExtensions.create()
  const { $ExtensionList } = state
  const event = new TouchEvent('touchstart', {
    bubbles: true,
    cancelable: true,
    changedTouches: [
      new Touch({
        identifier: 0,
        clientX: 10,
        clientY: 10,
        target: $ExtensionList,
      }),
    ],
  })
  $ExtensionList.dispatchEvent(event)
  expect(RendererWorker.send).toHaveBeenCalledTimes(1)
  expect(RendererWorker.send).toHaveBeenCalledWith(
    'Extensions.handleTouchStart',
    expect.any(Number),
    [{ clientX: 10, clientY: 10, identifier: 0 }]
  )
})

test('event - touchmove', () => {
  const state = ViewletExtensions.create()
  const { $ExtensionList } = state
  const event = new TouchEvent('touchmove', {
    bubbles: true,
    cancelable: true,
    changedTouches: [
      new Touch({
        identifier: 0,
        clientX: 10,
        clientY: 10,
        target: $ExtensionList,
      }),
    ],
  })
  $ExtensionList.dispatchEvent(event)
  expect(RendererWorker.send).toHaveBeenCalledTimes(1)
  expect(RendererWorker.send).toHaveBeenCalledWith(
    'Extensions.handleTouchMove',
    expect.any(Number),
    [{ clientX: 10, clientY: 10, identifier: 0 }]
  )
})

test('event - touchend', () => {
  const state = ViewletExtensions.create()
  const { $ExtensionList } = state
  const event = new TouchEvent('touchend', {
    bubbles: true,
    cancelable: true,
    changedTouches: [
      new Touch({
        identifier: 0,
        clientX: 10,
        clientY: 10,
        target: $ExtensionList,
      }),
    ],
  })
  $ExtensionList.dispatchEvent(event)
  expect(RendererWorker.send).toHaveBeenCalledTimes(1)
  expect(RendererWorker.send).toHaveBeenCalledWith(
    'Extensions.handleTouchEnd',
    [{ clientX: 10, clientY: 10, identifier: 0 }]
  )
})
