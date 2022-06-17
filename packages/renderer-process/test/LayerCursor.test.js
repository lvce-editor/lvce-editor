/**
 * @jest-environment jsdom
 */
import { jest } from '@jest/globals'
import * as LayerCursor from '../src/parts/Editor/LayerCursor.js'

const getVisualWidth = (text) => {
  switch (text) {
    case '👮🏽‍♀️':
      return 2
    default:
      return text.length
  }
}

beforeAll(() => {
  // this is not yet supported by jsdom
  // globalThis.CSS = {
  //   // @ts-ignore
  //   highlights: {
  //     items: Object.create(null),
  //     set(key, value) {
  //       this.items[key] = value
  //     },
  //     get(key) {
  //       return this.items[key]
  //     },
  //   },
  // }
  // globalThis.Highlight = class {
  //   constructor() {
  //     this.items = new Set()
  //   }
  //   add(item) {
  //     this.items.add(item)
  //   }
  //   values() {
  //     return this.items
  //   }
  // }
  Range.prototype.getBoundingClientRect = function () {
    console.log(this)
    const start = this.startContainer
    const endOffset = this.endOffset
    const text = this.startContainer.nodeValue
    const partialText = text.slice(0, endOffset)
    const visualWidth = getVisualWidth(partialText)
    const charWidth = 4
    const left = visualWidth * charWidth
    return {
      top: 0,
      left,
      width: 0,
      height: 0,
    }
  }
})

const simplifyStaticRange = (staticRange) => {
  return {
    startOffset: staticRange.startOffset,
    endOffset: staticRange.endOffset,
  }
}

const getHighlights = () => {
  // @ts-ignore
  const highlights = CSS.highlights.get('cursor')
  const ranges = [...highlights.values()]
  return ranges.map(simplifyStaticRange)
}

const create$Cursor = () => {
  const $Cursor = document.createElement('div')
  $Cursor.className = 'EditorCursor'
  return $Cursor
}

afterEach(() => {
  jest.restoreAllMocks()
})

test('setCursor - renderCursorsLess', () => {
  const $Token = document.createElement('span')
  $Token.textContent = 'abcde'
  const $EditorRow = document.createElement('div')
  $EditorRow.append($Token)
  const $LayerText = document.createElement('div')
  $LayerText.append($EditorRow)
  const $LayerCursor = document.createElement('div')
  const state = {
    $LayerCursor,
    $LayerText,
  }
  const cursors = [
    {
      top: 10,
      topIndex: 0,
      leftIndex: 0,
      remainingOffset: 5,
    },
  ]
  const spy = jest.spyOn(document, 'createElement')
  LayerCursor.setCursors(state, cursors)
  expect(state.$LayerCursor.innerHTML).toBe(
    '<div class="EditorCursor" style="top: 10px; left: 20px;"></div>'
  )
  expect(spy).toHaveBeenCalledTimes(1)
})

test('setCursor - renderCursorsEqual', () => {
  const $Token = document.createElement('span')
  $Token.textContent = 'abcde'
  const $EditorRow = document.createElement('div')
  $EditorRow.append($Token)
  const $LayerText = document.createElement('div')
  $LayerText.append($EditorRow)
  const $LayerCursor = document.createElement('div')
  $LayerCursor.append(create$Cursor())
  const state = {
    $LayerCursor,
    $LayerText,
  }
  const cursors = [
    {
      top: 10,
      topIndex: 0,
      leftIndex: 0,
      remainingOffset: 5,
    },
  ]
  const spy = jest.spyOn(document, 'createElement')
  LayerCursor.setCursors(state, cursors)
  expect(state.$LayerCursor.innerHTML).toBe(
    '<div class="EditorCursor" style="top: 10px; left: 20px;"></div>'
  )
  expect(spy).not.toHaveBeenCalled()
})

test('setCursor - renderCursorsEqual - Node without text', () => {
  const $Token = document.createElement('span')
  const $EditorRow = document.createElement('div')
  $EditorRow.append($Token)
  const $LayerText = document.createElement('div')
  $LayerText.append($EditorRow)
  const $LayerCursor = document.createElement('div')
  $LayerCursor.append(create$Cursor())
  const state = {
    $LayerCursor,
    $LayerText,
  }
  const cursors = [
    {
      top: 10,
      topIndex: 0,
      leftIndex: 0,
      remainingOffset: 0,
    },
  ]
  const spy = jest.spyOn(document, 'createElement')
  LayerCursor.setCursors(state, cursors)
  expect(state.$LayerCursor.innerHTML).toBe(
    '<div class="EditorCursor" style="top: 10px; left: 0px;"></div>'
  )
  expect(spy).not.toHaveBeenCalled()
})

test('setCursor - renderCursorsMore', () => {
  const $Token = document.createElement('span')
  $Token.textContent = 'abcde'
  const $EditorRow = document.createElement('div')
  $EditorRow.append($Token)
  const $LayerText = document.createElement('div')
  $LayerText.append($EditorRow)
  const $LayerCursor = document.createElement('div')
  $LayerCursor.append(create$Cursor())
  $LayerCursor.append(create$Cursor())
  const state = {
    $LayerCursor,
    $LayerText,
  }
  const cursors = [
    {
      top: 10,
      topIndex: 0,
      leftIndex: 0,
      remainingOffset: 5,
    },
  ]
  const spy = jest.spyOn(document, 'createElement')
  LayerCursor.setCursors(state, cursors)
  expect(state.$LayerCursor.innerHTML).toBe(
    '<div class="EditorCursor" style="top: 10px; left: 20px;"></div>'
  )
  expect(spy).not.toHaveBeenCalled()
})

test('setCursor - emoji - 👮🏽‍♀️', () => {
  const $Token = document.createElement('span')
  $Token.textContent = '👮🏽‍♀️'
  const $EditorRow = document.createElement('div')
  $EditorRow.append($Token)
  const $LayerText = document.createElement('div')
  $LayerText.append($EditorRow)
  const $LayerCursor = document.createElement('div')
  $LayerCursor.append(create$Cursor())
  const state = {
    $LayerCursor,
    $LayerText,
  }
  const cursors = [
    {
      top: 10,
      topIndex: 0,
      leftIndex: 0,
      remainingOffset: 7,
    },
  ]
  LayerCursor.setCursors(state, cursors)
  expect(state.$LayerCursor.innerHTML).toBe(
    '<div class="EditorCursor" style="top: 10px; left: 8px;"></div>'
  )
})
