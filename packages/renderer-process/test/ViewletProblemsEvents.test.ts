/**
 * @jest-environment jsdom
 */
import { jest } from '@jest/globals'
import { beforeEach, test, expect, beforeAll } from '@jest/globals'
import * as ComponentUid from '../src/parts/ComponentUid/ComponentUid.ts'

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

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/ExecuteViewletCommand/ExecuteViewletCommand.ts', () => {
  return {
    executeViewletCommand: jest.fn(() => {}),
  }
})

const ExecuteViewletCommand = await import('../src/parts/ExecuteViewletCommand/ExecuteViewletCommand.ts')
const ViewletProblems = await import('../src/parts/ViewletProblems/ViewletProblems.ts')

test('event - pointerdown', () => {
  const state = ViewletProblems.create()
  const { $Viewlet } = state
  ComponentUid.set($Viewlet, 1)
  ViewletProblems.attachEvents(state)
  const event = new MouseEvent('pointerdown', {
    bubbles: true,
    clientX: 15,
    clientY: 30,
    cancelable: true,
  })
  $Viewlet.dispatchEvent(event)
  expect(ExecuteViewletCommand.executeViewletCommand).toHaveBeenCalledTimes(1)
  expect(ExecuteViewletCommand.executeViewletCommand).toHaveBeenCalledWith(1, 'handleClickAt', 15, 30)
  expect(event.defaultPrevented).toBe(true)
})
