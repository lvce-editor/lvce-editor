/**
 * @jest-environment jsdom
 */
import { jest } from '@jest/globals'
import * as MouseEventType from '../src/parts/MouseEventType/MouseEventType.js'
import * as ComponentUid from '../src/parts/ComponentUid/ComponentUid.js'

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

  HTMLElement.prototype.setPointerCapture = () => {}
  HTMLElement.prototype.releasePointerCapture = () => {}

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
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/ExecuteViewletCommand/ExecuteViewletCommand.js', () => {
  return {
    executeViewletCommand: jest.fn(() => {}),
  }
})

const ExecuteViewletCommand = await import('../src/parts/ExecuteViewletCommand/ExecuteViewletCommand.js')
const ViewletExtensions = await import('../src/parts/ViewletExtensions/ViewletExtensions.js')

test('event - input', () => {
  const state = ViewletExtensions.create()
  const { $Viewlet } = state
  ComponentUid.set($Viewlet, 1)
  ViewletExtensions.attachEvents(state)
  const { $InputBox } = state
  $InputBox.value = 'abc'
  $InputBox.dispatchEvent(
    new InputEvent('input', {
      bubbles: true,
      cancelable: true,
    })
  )
  expect(ExecuteViewletCommand.executeViewletCommand).toHaveBeenCalledTimes(1)
  expect(ExecuteViewletCommand.executeViewletCommand).toHaveBeenCalledWith(1, 'handleInput', 'abc')
  ViewletExtensions.setExtensions(state, [])
})

// TODO
test.skip('event - click on install', () => {
  const state = ViewletExtensions.create()
  const { $Viewlet } = state
  ComponentUid.set($Viewlet, 1)
  ViewletExtensions.attachEvents(state)
  ViewletExtensions.setExtensions(state, [
    {
      id: 'test-author.test=extension-1',
      name: 'Test Extension 1',
      state: 'uninstalled',
    },
  ])
  const { $ListItems } = state
  $ListItems.children[0]
    // @ts-ignore
    .querySelector('.ExtensionManage')
    .dispatchEvent(
      new Event('click', {
        bubbles: true,
        cancelable: true,
      })
    )
  expect(ExecuteViewletCommand.executeViewletCommand).toHaveBeenCalledWith([1, 2133, 'Extensions', 'handleInstall', 'test-author.test=extension-1'])
})

test.skip('user clicks while installing', () => {
  const state = ViewletExtensions.create()
  const { $Viewlet } = state
  ComponentUid.set($Viewlet, 1)
  ViewletExtensions.attachEvents(state)
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
  expect(ExecuteViewletCommand.executeViewletCommand).not.toHaveBeenCalled()
})

test('event - click - on extension', () => {
  const state = ViewletExtensions.create()
  const { $Viewlet } = state
  ComponentUid.set($Viewlet, 1)
  ViewletExtensions.attachEvents(state)
  ViewletExtensions.setExtensions(state, [
    {
      id: 'test-author.test=extension-1',
      name: 'Test Extension 1',
      state: 'uninstalled',
    },
  ])
  const { $ListItems } = state
  $ListItems.children[0].dispatchEvent(
    new PointerEvent('pointerdown', {
      bubbles: true,
      cancelable: true,
      button: MouseEventType.LeftClick,
    })
  )
  expect(ExecuteViewletCommand.executeViewletCommand).toHaveBeenCalledTimes(1)
  expect(ExecuteViewletCommand.executeViewletCommand).toHaveBeenCalledWith(1, 'handleClick', 0)
})

// TODO
test.skip('user clicks uninstall', () => {
  const state = ViewletExtensions.create()
  const { $Viewlet } = state
  ComponentUid.set($Viewlet, 1)
  ViewletExtensions.attachEvents(state)
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
  expect(ExecuteViewletCommand.executeViewletCommand).toHaveBeenCalledWith([1, 2133, 'Extensions', 'handleUninstall', 'test-author.test-extension-1'])
})

test('icon - error', () => {
  const state = ViewletExtensions.create()
  const { $Viewlet } = state
  ComponentUid.set($Viewlet, 1)
  ViewletExtensions.attachEvents(state)
  ViewletExtensions.setExtensions(state, [
    {
      name: 'Test Extension 1',
      publisher: 'Test Author',
      icon: '/not-found.png',
    },
  ])
  const { $ListItems } = state
  const $FirstExtension = $ListItems.children[0]
  const $FirstIcon = $FirstExtension.querySelector('.ExtensionListItemIcon')
  // @ts-ignore
  expect($FirstIcon.src).toBe('http://localhost/not-found.png')
  $FirstIcon.dispatchEvent(new ErrorEvent('error', { bubbles: true }))
  // @ts-ignore
  expect($FirstIcon.src).toBe('http://localhost/icons/extensionDefaultIcon.png')
})

test('icon - error - endless loop bug', () => {
  const state = ViewletExtensions.create()
  const { $Viewlet } = state
  ComponentUid.set($Viewlet, 1)
  ViewletExtensions.attachEvents(state)
  ViewletExtensions.setExtensions(state, [
    {
      name: 'Test Extension 1',
      publisher: 'Test Author',
      icon: '/not-found.png',
    },
  ])
  const { $ListItems } = state
  const $FirstExtension = $ListItems.children[0]
  // @ts-ignore
  const $FirstIcon = $FirstExtension.querySelector('.ExtensionListItemIcon')
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
  const { $Viewlet } = state
  ComponentUid.set($Viewlet, 1)
  ViewletExtensions.attachEvents(state)
  const { $ListItems } = state
  const event = new TouchEvent('touchstart', {
    bubbles: true,
    cancelable: true,
    changedTouches: [
      new Touch({
        identifier: 0,
        clientX: 10,
        clientY: 10,
        target: $ListItems,
      }),
    ],
  })
  $ListItems.dispatchEvent(event)
  expect(ExecuteViewletCommand.executeViewletCommand).toHaveBeenCalledTimes(1)
  expect(ExecuteViewletCommand.executeViewletCommand).toHaveBeenCalledWith(1, 'handleTouchStart', expect.any(Number), [
    { x: 10, y: 10, identifier: 0 },
  ])
})

test('event - touchmove', () => {
  const state = ViewletExtensions.create()
  const { $Viewlet } = state
  ComponentUid.set($Viewlet, 1)
  ViewletExtensions.attachEvents(state)
  const { $ListItems } = state
  const event = new TouchEvent('touchmove', {
    bubbles: true,
    cancelable: true,
    changedTouches: [
      new Touch({
        identifier: 0,
        clientX: 10,
        clientY: 10,
        target: $ListItems,
      }),
    ],
  })
  $ListItems.dispatchEvent(event)
  expect(ExecuteViewletCommand.executeViewletCommand).toHaveBeenCalledTimes(1)
  expect(ExecuteViewletCommand.executeViewletCommand).toHaveBeenCalledWith(1, 'handleTouchMove', expect.any(Number), [
    { x: 10, y: 10, identifier: 0 },
  ])
})

test('event - touchend', () => {
  const state = ViewletExtensions.create()
  const { $Viewlet } = state
  ComponentUid.set($Viewlet, 1)
  ViewletExtensions.attachEvents(state)
  const { $ListItems } = state
  const event = new TouchEvent('touchend', {
    bubbles: true,
    cancelable: true,
    changedTouches: [
      new Touch({
        identifier: 0,
        clientX: 10,
        clientY: 10,
        target: $ListItems,
      }),
    ],
  })
  $ListItems.dispatchEvent(event)
  expect(ExecuteViewletCommand.executeViewletCommand).toHaveBeenCalledTimes(1)
  expect(ExecuteViewletCommand.executeViewletCommand).toHaveBeenCalledWith(1, 'handleTouchEnd', [{ x: 10, y: 10, identifier: 0 }])
})

test('event - pointerdown - on scroll bar thumb', () => {
  const state = ViewletExtensions.create()
  const { $Viewlet } = state
  ComponentUid.set($Viewlet, 1)
  ViewletExtensions.attachEvents(state)
  const { $ScrollBarThumb } = state
  const event = new PointerEvent('pointerdown', {
    bubbles: true,
    clientX: 10,
    clientY: 20,
    pointerId: 0,
    button: MouseEventType.LeftClick,
  })
  $ScrollBarThumb.dispatchEvent(event)
  expect(ExecuteViewletCommand.executeViewletCommand).toHaveBeenCalledTimes(1)
  expect(ExecuteViewletCommand.executeViewletCommand).toHaveBeenCalledWith(1, 'handleScrollBarClick', 20)
})

test('event - contextmenu - activated via keyboard', () => {
  const state = ViewletExtensions.create()
  const { $Viewlet } = state
  ComponentUid.set($Viewlet, 1)
  ViewletExtensions.attachEvents(state)
  const { $ListItems } = state
  $ListItems.dispatchEvent(
    new MouseEvent('contextmenu', {
      clientX: 50,
      clientY: 50,
      bubbles: true,
      button: -1,
    })
  )
  expect(ExecuteViewletCommand.executeViewletCommand).toHaveBeenCalledTimes(1)
  expect(ExecuteViewletCommand.executeViewletCommand).toHaveBeenCalledWith(1, 'handleContextMenu', -1, 50, 50)
})
