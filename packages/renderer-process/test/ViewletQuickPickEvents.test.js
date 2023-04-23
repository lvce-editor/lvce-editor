/**
 * @jest-environment jsdom
 */
import { jest } from '@jest/globals'
import * as ComponentUid from '../src/parts/ComponentUid/ComponentUid.js'
import * as WheelEventType from '../src/parts/WheelEventType/WheelEventType.js'

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

jest.unstable_mockModule('../src/parts/ExecuteViewletCommand/ExecuteViewletCommand.js', () => {
  return {
    executeViewletCommand: jest.fn(() => {}),
  }
})

const ExecuteViewletCommand = await import('../src/parts/ExecuteViewletCommand/ExecuteViewletCommand.js')
const ViewletQuickPick = await import('../src/parts/ViewletQuickPick/ViewletQuickPick.js')

test.skip('event - mousedown', () => {
  const state = ViewletQuickPick.create()
  const { $Viewlet } = state
  ComponentUid.set($Viewlet, 1)
  ViewletQuickPick.setPicks(state, [
    {
      posInSet: 1,
      setSize: 2,
      label: 'item 1',
    },
    {
      posInSet: 2,
      setSize: 2,
      label: 'item 2',
    },
  ])
  const $QuickPickItemTwo = state.$QuickPickItems.children[1]
  $QuickPickItemTwo.dispatchEvent(
    new MouseEvent('mousedown', {
      bubbles: true,
      cancelable: true,
    })
  )
  expect(ExecuteViewletCommand.executeViewletCommand).toHaveBeenCalledTimes(1)
  expect(ExecuteViewletCommand.executeViewletCommand).toHaveBeenCalledWith(['QuickPick.selectIndex', 1])
})

test('event - pointerdown - on focused item', () => {
  const state = ViewletQuickPick.create()
  const { $Viewlet } = state
  ComponentUid.set($Viewlet, 1)
  ViewletQuickPick.attachEvents(state)
  ViewletQuickPick.setPicks(state, [
    {
      posInSet: 1,
      setSize: 1,
      label: 'item 1',
    },
  ])
  ViewletQuickPick.setFocusedIndex(state, 0, -1)
  const { $QuickPickItems } = state
  const $QuickPickItemOne = $QuickPickItems.children[0]
  const event = new MouseEvent('pointerdown', {
    bubbles: true,
    cancelable: true,
  })
  $QuickPickItemOne.dispatchEvent(event)
  expect(ExecuteViewletCommand.executeViewletCommand).toHaveBeenCalledTimes(1)
  expect(ExecuteViewletCommand.executeViewletCommand).toHaveBeenCalledWith(1, 'handleClickAt', 0, 0)
})

test.skip('event - beforeinput', () => {
  const state = ViewletQuickPick.create()
  const { $Viewlet } = state
  ComponentUid.set($Viewlet, 1)
  ViewletQuickPick.attachEvents(state)
  ViewletQuickPick.setPicks(state, [
    {
      posInSet: 1,
      setSize: 2,
      label: 'item 1',
    },
    {
      posInSet: 2,
      setSize: 2,
      label: 'item 2',
    },
  ])
  const $QuickPickInput = state.$QuickPickInput
  $QuickPickInput.dispatchEvent(
    new InputEvent('beforeinput', {
      bubbles: true,
      cancelable: true,
      data: 'a',
    })
  )
  expect(ExecuteViewletCommand.executeViewletCommand).toHaveBeenCalledWith(1, 'handleInput', '>a')
})

test('event - wheel', () => {
  const state = ViewletQuickPick.create()
  const { $Viewlet } = state
  ComponentUid.set($Viewlet, 1)
  ViewletQuickPick.attachEvents(state)
  const event = new WheelEvent('wheel', {
    deltaY: 53,
    deltaMode: WheelEventType.DomDeltaLine,
  })
  const { $QuickPickItems } = state
  $QuickPickItems.dispatchEvent(event)
  expect(ExecuteViewletCommand.executeViewletCommand).toHaveBeenCalledTimes(1)
  expect(ExecuteViewletCommand.executeViewletCommand).toHaveBeenCalledWith(1, 'handleWheel', 1, 53)
})
