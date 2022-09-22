/**
 * @jest-environment jsdom
 */
import { jest } from '@jest/globals'
import * as MenuEntryId from '../src/parts/MenuEntryId/MenuEntryId.js'
import * as WheelEventType from '../src/parts/WheelEventType/WheelEventType.js'
import * as MouseEventType from '../src/parts/MouseEventType/MouseEventType.js'

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

const Editor = await import('../src/parts/Editor/Editor.js')
const EditorEvents = await import('../src/parts/Editor/EditorEvents.js')
const Platform = await import('../src/parts/Platform/Platform.js')
const EditorHelper = await import('../src/parts/Editor/EditorHelper.js')

afterEach(() => {
  jest.restoreAllMocks()
  Platform.state.cachedIsMobileOrTablet = undefined
})

const create$EditorRow = () => {
  const $EditorRow = document.createElement('div')
  $EditorRow.className = 'EditorRow'
  return $EditorRow
}

const create$Token = (text, className) => {
  const $Token = document.createElement('span')
  $Token.className = className
  $Token.textContent = text
  return $Token
}

test('event - mousedown - left', () => {
  const state = Editor.create()
  const $Token = document.createElement('span')
  $Token.textContent = 'abcde'
  const $EditorRow = document.createElement('div')
  $EditorRow.append($Token)
  state.$LayerText.append($EditorRow)
  // @ts-ignore
  RendererWorker.send.mockImplementation(() => {})
  // @ts-ignore
  document.caretPositionFromPoint = () => {
    return {
      offsetNode: $Token.firstChild,
      offset: 2,
    }
  }
  state.$LayerText.dispatchEvent(
    new MouseEvent('mousedown', { detail: 1, clientX: 8, clientY: 5 })
  )
  expect(RendererWorker.send).toHaveBeenCalledWith(
    'Editor.handleSingleClick',
    '',
    8,
    5,
    2
  )
})

test('event - mousedown - right', () => {
  const state = Editor.create()
  const $Token = document.createElement('span')
  $Token.textContent = 'abcde'
  const $EditorRow = document.createElement('div')
  $EditorRow.append($Token)
  state.$LayerText.append($EditorRow)
  // @ts-ignore
  RendererWorker.send.mockImplementation(() => {})
  // @ts-ignore
  document.caretPositionFromPoint = () => {
    return {
      offsetNode: $Token.firstChild,
      offset: 2,
    }
  }
  state.$LayerText.dispatchEvent(
    new MouseEvent('mousedown', {
      detail: 1,
      clientX: 8,
      clientY: 5,
      button: 2,
    })
  )
  expect(RendererWorker.send).not.toHaveBeenCalled()
})

test('event - mousedown - left - out of viewport', () => {
  const state = Editor.create()
  const $Token = document.createElement('span')
  $Token.textContent = 'abcde'
  const $EditorRow = document.createElement('div')
  $EditorRow.append($Token)
  state.$LayerText.append($EditorRow)
  // @ts-ignore
  RendererWorker.send.mockImplementation(() => {})
  // @ts-ignore
  document.caretPositionFromPoint = () => {
    return null
  }
  state.$LayerText.dispatchEvent(
    new MouseEvent('mousedown', {
      detail: 1,
      clientX: -10,
      clientY: -10,
    })
  )
  expect(RendererWorker.send).toHaveBeenCalledTimes(1)
  expect(RendererWorker.send).toHaveBeenCalledWith(
    'Editor.handleSingleClick',
    '',
    -10,
    -10,
    0
  )
})

test('event - double click', () => {
  const state = Editor.create()
  const $Token = document.createElement('span')
  $Token.textContent = 'abcde'
  const $EditorRow = document.createElement('div')
  $EditorRow.append($Token)
  state.$LayerText.append($EditorRow)
  // @ts-ignore
  RendererWorker.send.mockImplementation(() => {})
  // @ts-ignore
  document.caretPositionFromPoint = () => {
    return {
      offsetNode: $Token.firstChild,
      offset: 2,
    }
  }
  EditorHelper.setState(1, state)
  document.body.append(state.$Editor)
  // @ts-ignore
  RendererWorker.send.mockImplementation(() => {})
  state.$LayerText.dispatchEvent(
    new MouseEvent('mousedown', { detail: 2, clientX: 8, clientY: 5 })
  )
  expect(RendererWorker.send).toHaveBeenCalledWith(
    'Editor.handleDoubleClick',
    8,
    5,
    2
  )
})

test.skip('event - double click and move mouse to create selection', () => {
  // @ts-ignore
  const state = Editor.create(1, '/tmp/file1')
  // @ts-ignore
  Editor.setTextDocument(state, {
    lines: ['file2 content'],
  })
  state.$LayerText.dispatchEvent(
    new MouseEvent('mousedown', { detail: 2, clientX: 10, clientY: 5 })
  )
  // @ts-ignore
  RendererWorker.send.mockImplementation(() => {})
  document.dispatchEvent(
    new MouseEvent('mousemove', { clientX: 15, clientY: 5 })
  )
  expect(RendererWorker.send).toHaveBeenCalledWith([
    363,
    {
      columnIndex: 3,
      rowIndex: 0,
    },
  ])
  document.dispatchEvent(
    new MouseEvent('mousemove', { clientX: 20, clientY: 5 })
  )
  expect(RendererWorker.send).toHaveBeenCalledWith([
    363,
    {
      columnIndex: 4,
      rowIndex: 0,
    },
  ])
})

test('event - triple click', () => {
  const state = Editor.create()
  const $Token = document.createElement('span')
  $Token.textContent = 'abcde'
  const $EditorRow = document.createElement('div')
  $EditorRow.append($Token)
  state.$LayerText.append($EditorRow)
  // @ts-ignore
  RendererWorker.send.mockImplementation(() => {})
  // @ts-ignore
  document.caretPositionFromPoint = () => {
    return {
      offsetNode: $Token.firstChild,
      offset: 2,
    }
  }
  state.$LayerText.dispatchEvent(
    new MouseEvent('mousedown', { detail: 3, clientX: 8, clientY: 5 })
  )
  expect(RendererWorker.send).toHaveBeenCalledWith(
    'Editor.handleTripleClick',
    8,
    5,
    2
  )
})

test.skip('event - touchstart - single touch', () => {
  const state = Editor.create()
  EditorHelper.setState(1, state)
  // @ts-ignore
  RendererWorker.send.mockImplementation(() => {})
  state.$LayerText.dispatchEvent(
    new TouchEvent('touchstart', {
      touches: [
        // @ts-ignore https://github.com/jsdom/jsdom/issues/2152
        {
          clientX: 10,
          clientY: 5,
          identifier: 0,
          target: state.$LayerText,
        },
      ],
      bubbles: true,
      cancelable: true,
    })
  )
  expect(RendererWorker.send).toHaveBeenCalledWith([
    404,
    {
      touches: [
        {
          x: 10,
          y: 5,
        },
      ],
      changedTouches: [],
    },
  ])
})

test.skip('event - touchmove - single touch', () => {
  const state = Editor.create()
  EditorHelper.setState(1, state)
  // @ts-ignore
  RendererWorker.send.mockImplementation(() => {})
  state.$LayerText.dispatchEvent(
    new TouchEvent('touchmove', {
      touches: [
        // @ts-ignore https://github.com/jsdom/jsdom/issues/2152
        {
          clientX: 10,
          clientY: 5,
          identifier: 0,
          target: state.$LayerText,
        },
      ],
      bubbles: true,
      cancelable: true,
    })
  )
  expect(RendererWorker.send).toHaveBeenCalledWith([
    405,
    {
      touches: [
        {
          x: 10,
          y: 5,
        },
      ],
      changedTouches: [],
    },
  ])
})

test.skip('event - touchend - single touch', () => {
  Platform.state.isMobileOrTablet = () => {
    return true
  }
  const state = Editor.create()
  EditorHelper.setState(1, state)
  // @ts-ignore
  RendererWorker.send.mockImplementation(() => {})
  const event = new TouchEvent('touchend', {
    touches: [
      // @ts-ignore https://github.com/jsdom/jsdom/issues/2152
      {
        clientX: 10,
        clientY: 5,
        identifier: 0,
        target: state.$LayerText,
      },
    ],
    bubbles: true,
    cancelable: true,
  })
  state.$Editor.dispatchEvent(event)
  expect(event.defaultPrevented).toBe(true)
  expect(RendererWorker.send).toHaveBeenCalledTimes(1)
  expect(RendererWorker.send).toHaveBeenCalledWith('Editor.handleTouchEnd', {
    touches: [
      {
        x: 10,
        y: 5,
      },
    ],
    changedTouches: [],
  })
})

test.skip('event - touchend - single touch - not cancelable', () => {
  Platform.state.isMobileOrTablet = () => {
    return true
  }
  const state = Editor.create()
  EditorHelper.setState(1, state)
  // @ts-ignore
  RendererWorker.send.mockImplementation(() => {})
  const event = new TouchEvent('touchend', {
    touches: [
      // @ts-ignore https://github.com/jsdom/jsdom/issues/2152
      {
        clientX: 10,
        clientY: 5,
        identifier: 0,
        target: state.$LayerText,
      },
    ],
    bubbles: true,
    cancelable: false,
  })
  state.$Editor.dispatchEvent(event)
  expect(event.defaultPrevented).toBe(false)
  expect(RendererWorker.send).toHaveBeenCalledTimes(1)
  expect(RendererWorker.send).toHaveBeenCalledWith('Editor.handleTouchEnd', {
    touches: [
      {
        x: 10,
        y: 5,
      },
    ],
    changedTouches: [],
  })
})

// TODO
test.skip('event - paste', () => {
  // @ts-ignore
  const state = Editor.create(1, '/tmp/file1')
  // @ts-ignore
  Editor.setTextDocument(state, {
    lines: ['file1 content'],
  })
  // @ts-ignore
  RendererWorker.send.mockImplementation(() => {})
  state.$EditorInput.dispatchEvent(new Event('paste', { bubbles: true }))
  expect(RendererWorker.send).toHaveBeenCalledWith([
    'Editor.handleSingleClick',
    0,
    2,
  ])
})

test('event - context menu', () => {
  Platform.state.isMobileOrTablet = () => {
    return false
  }
  const state = Editor.create()
  EditorHelper.setState(1, state)
  document.body.append(state.$Editor)
  // @ts-ignore
  RendererWorker.send.mockImplementation(() => {})
  state.$LayerText.dispatchEvent(
    new MouseEvent('contextmenu', {
      bubbles: true,
      clientX: 15,
      clientY: 30,
    })
  )
  expect(RendererWorker.send).toHaveBeenCalledTimes(1)
  expect(RendererWorker.send).toHaveBeenCalledWith(
    'ContextMenu.show',
    15,
    30,
    MenuEntryId.Editor
  )
})

test.skip('event - beforeinput on contenteditable on mobile - no selection', () => {
  Platform.state.isMobileOrTablet = () => true
  const state = Editor.create()
  EditorHelper.setState(1, state)
  // @ts-ignore
  RendererWorker.send.mockImplementation(() => {})
  const spy = jest.spyOn(console, 'error').mockImplementation(() => {})
  state.$LayerText.dispatchEvent(
    new InputEvent('beforeinput', {
      data: 'a',
      bubbles: true,
      cancelable: true,
    })
  )
  console.log(Platform.state.isMobileOrTablet)
  expect(RendererWorker.send).not.toHaveBeenCalled()
  expect(spy).toHaveBeenCalledWith(
    '[Editor] cannot handle input event without selection'
  )
})

test('event - wheel', () => {
  // TODO mock platform module instead
  Platform.state.isMobileOrTablet = () => false
  const state = Editor.create()
  // @ts-ignore
  RendererWorker.send.mockImplementation(() => {})
  state.$ScrollBarThumb.dispatchEvent(
    new WheelEvent('wheel', {
      deltaX: 1,
      deltaY: 42,
      bubbles: true,
      cancelable: true,
      deltaMode: WheelEventType.DomDeltaPixel,
    })
  )
  expect(RendererWorker.send).toHaveBeenCalledTimes(1)
  expect(RendererWorker.send).toHaveBeenCalledWith('Editor.setDeltaY', 42)
})

test('event - pointerdown - on scroll bar thumb', () => {
  // @ts-ignore
  RendererWorker.send.mockImplementation(() => {})
  const state = Editor.create()
  const { $ScrollBarThumb } = state
  const event = new PointerEvent('pointerdown', {
    bubbles: true,
    clientX: 10,
    clientY: 20,
    pointerId: 0,
    button: MouseEventType.LeftClick,
  })
  $ScrollBarThumb.dispatchEvent(event)
  expect(RendererWorker.send).not.toHaveBeenCalled()
})

test('event - pointermove after pointerdown - on scroll bar thumb', () => {
  // @ts-ignore
  RendererWorker.send.mockImplementation(() => {})
  const state = Editor.create()
  const { $ScrollBarThumb } = state
  const pointerDownEvent = new PointerEvent('pointerdown', {
    bubbles: true,
    clientX: 10,
    clientY: 20,
    pointerId: 0,
    button: MouseEventType.LeftClick,
  })
  $ScrollBarThumb.dispatchEvent(pointerDownEvent)
  const pointerMoveEvent = new PointerEvent('pointermove', {
    bubbles: true,
    clientX: 30,
    clientY: 40,
    pointerId: 0,
    button: MouseEventType.LeftClick,
  })
  $ScrollBarThumb.dispatchEvent(pointerMoveEvent)
  expect(RendererWorker.send).toHaveBeenCalledTimes(1)
  expect(RendererWorker.send).toHaveBeenNthCalledWith(
    1,
    'Editor.handleScrollBarMove',
    40
  )
})

test('event - pointerup after pointerdown - on scroll bar thumb', () => {
  // @ts-ignore
  RendererWorker.send.mockImplementation(() => {})
  const state = Editor.create()
  const spy1 = jest.spyOn(HTMLElement.prototype, 'addEventListener')
  const spy2 = jest.spyOn(HTMLElement.prototype, 'removeEventListener')
  // @ts-ignore
  const spy3 = jest.spyOn(HTMLElement.prototype, 'setPointerCapture')
  // @ts-ignore
  const spy4 = jest.spyOn(HTMLElement.prototype, 'releasePointerCapture')
  const { $ScrollBarThumb } = state
  const pointerDownEvent = new PointerEvent('pointerdown', {
    bubbles: true,
    clientX: 10,
    clientY: 20,
    pointerId: 0,
    button: MouseEventType.LeftClick,
  })
  $ScrollBarThumb.dispatchEvent(pointerDownEvent)
  expect(spy1).toHaveBeenCalledTimes(2)
  expect(spy1).toHaveBeenNthCalledWith(
    1,
    'pointermove',
    EditorEvents.handleScrollBarThumbPointerMove,
    { passive: false }
  )
  expect(spy1).toHaveBeenNthCalledWith(
    2,
    'pointerup',
    EditorEvents.handleScrollBarThumbPointerUp
  )
  expect(spy3).toHaveBeenCalledTimes(1)
  expect(spy3).toHaveBeenCalledWith(0)
  const pointerUpEvent = new PointerEvent('pointerup', {
    bubbles: true,
    clientX: 10,
    clientY: 20,
    pointerId: 0,
    button: MouseEventType.LeftClick,
  })
  $ScrollBarThumb.dispatchEvent(pointerUpEvent)
  expect(spy4).toHaveBeenCalledTimes(1)
  expect(spy4).toHaveBeenCalledWith(0)
  expect(spy2).toHaveBeenCalledTimes(2)
  expect(spy2).toHaveBeenNthCalledWith(
    1,
    'pointermove',
    EditorEvents.handleScrollBarThumbPointerMove
  )
  expect(spy2).toHaveBeenNthCalledWith(
    2,
    'pointerup',
    EditorEvents.handleScrollBarThumbPointerUp
  )
})

test.skip('event - beforeinput on contenteditable on mobile - cursor in middle', () => {
  Platform.state.isMobileOrTablet = () => true
  const state = Editor.create()
  EditorHelper.setState(1, state)
  const $Token1 = create$Token('  ', 'Whitespace')
  const $Token2 = create$Token('background', 'CssPropertyName')
  const $Token3 = create$Token(':', 'Punctuation')
  const $Token4 = create$Token(' ', 'Whitespace')
  const $Row1 = create$EditorRow()
  $Row1.append($Token1, $Token2, $Token3, $Token4)
  state.$LayerText.append($Row1)
  document.body.append(state.$Editor)
  const range = document.createRange()
  range.setStart($Token2.firstChild, 4)
  document.getSelection().removeAllRanges()
  document.getSelection().addRange(range)
  // @ts-ignore
  RendererWorker.send.mockImplementation(() => {})
  state.$LayerText.dispatchEvent(
    new InputEvent('beforeinput', {
      data: 'a',
      bubbles: true,
      cancelable: true,
    })
  )
  expect(RendererWorker.send).toHaveBeenCalledWith(
    'Editor.handleBeforeInputFromContentEditable',
    'a',
    {
      startColumnIndex: 6,
      startRowIndex: 0,
      endColumnIndex: 6,
      endRowIndex: 0,
    }
  )
})

test('event - composition', () => {
  Platform.state.isMobileOrTablet = () => false
  const state = Editor.create()
  EditorHelper.setState(1, state)
  const $Row1 = create$EditorRow()
  state.$LayerText.append($Row1)
  document.body.append(state.$Editor)
  // @ts-ignore
  RendererWorker.send.mockImplementation(() => {})
  state.$EditorInput.dispatchEvent(
    new CompositionEvent('compositionstart', {
      data: 'a',
      bubbles: true,
      cancelable: true,
    })
  )
  state.$EditorInput.dispatchEvent(
    new CompositionEvent('compositionend', {
      data: 'ñ',
      bubbles: true,
      cancelable: true,
    })
  )
  expect(RendererWorker.send).toHaveBeenCalledTimes(2)
  expect(RendererWorker.send).toHaveBeenNthCalledWith(
    1,
    'Editor.compositionStart',
    'a'
  )
  expect(RendererWorker.send).toHaveBeenNthCalledWith(
    2,
    'Editor.compositionEnd',
    'ñ'
  )
})

test.skip('event - beforeinput on contenteditable on mobile - word in middle selected', () => {
  Platform.state.isMobileOrTablet = () => true
  const state = Editor.create()
  EditorHelper.setState(1, state)
  const $Token1 = create$Token('  ', 'Whitespace')
  const $Token2 = create$Token('background', 'CssPropertyName')
  const $Token3 = create$Token(':', 'Punctuation')
  const $Token4 = create$Token(' ', 'Whitespace')
  const $Row1 = create$EditorRow()
  $Row1.append($Token1, $Token2, $Token3, $Token4)
  state.$LayerText.append($Row1)
  document.body.append(state.$Editor)
  const range = document.createRange()
  range.setStart($Token2.firstChild, 0)
  range.setEnd($Token2.firstChild, 10)
  document.getSelection().removeAllRanges()
  document.getSelection().addRange(range)
  // @ts-ignore
  RendererWorker.send.mockImplementation(() => {})
  state.$LayerText.dispatchEvent(
    new InputEvent('beforeinput', {
      data: 'a',
      bubbles: true,
      cancelable: true,
    })
  )
  expect(RendererWorker.send).toHaveBeenCalledWith(
    'Editor.handleBeforeInputFromContentEditable',
    'a',
    {
      startColumnIndex: 2,
      startRowIndex: 0,
      endColumnIndex: 12,
      endRowIndex: 0,
    }
  )
})

test.skip('event - native selection change', () => {
  Platform.state.isMobileOrTablet = () => true
  const state = Editor.create()
  const $Token1 = create$Token('  ', 'Whitespace')
  const $Token2 = create$Token('background', 'CssPropertyName')
  const $Token3 = create$Token(' ', 'Whitespace')
  const $Token4 = create$Token(':', 'Punctuation')
  const $Token5 = create$Token(' ', 'Whitespace')
  const $Row1 = create$EditorRow()
  $Row1.append($Token1, $Token2, $Token3, $Token4, $Token5)
  state.$LayerText.append($Row1)
  const $Viewlet = document.createElement('div')
  $Viewlet.className = 'Viewlet'
  $Viewlet.dataset.viewletId = '1'
  $Viewlet.append(state.$Editor)
  document.body.append($Viewlet)
  const range = document.createRange()
  range.setStart($Token3.firstChild, 1)
  range.setEnd($Token3.firstChild, 1)
  document.getSelection().removeAllRanges()
  document.getSelection().addRange(range)
  // @ts-ignore
  RendererWorker.send.mockImplementation(() => {})
  state.$LayerText.dispatchEvent(
    new InputEvent('selectionchange', {
      bubbles: true,
      cancelable: true,
    })
  )
  expect(RendererWorker.send).toHaveBeenCalledWith([
    408,
    {
      endColumnIndex: 13,
      endRowIndex: 0,
      startColumnIndex: 13,
      startRowIndex: 0,
    },
  ])
})
