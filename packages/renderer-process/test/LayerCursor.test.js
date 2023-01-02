/**
 * @jest-environment jsdom
 */
import { jest } from '@jest/globals'
import * as LayerCursor from '../src/parts/Editor/LayerCursor.js'

beforeAll(() => {
  // workaround for translate property not being supported in jsdom
  Object.defineProperty(CSSStyleDeclaration.prototype, 'translate', {
    get() {
      return this.getPropertyValue('translate')
    },
    set(value) {
      this._setProperty('translate', value)
    },
  })
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
  const cursors = [10, 20]
  const spy = jest.spyOn(document, 'createElement')
  LayerCursor.setCursors(state, cursors)
  expect(state.$LayerCursor.innerHTML).toBe('<div class="EditorCursor" style="translate: 20px 10px;"></div>')
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
  const cursors = [10, 20]
  const spy = jest.spyOn(document, 'createElement')
  LayerCursor.setCursors(state, cursors)
  expect(state.$LayerCursor.innerHTML).toBe('<div class="EditorCursor" style="translate: 20px 10px;"></div>')
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
  const cursors = [10, 0]
  const spy = jest.spyOn(document, 'createElement')
  LayerCursor.setCursors(state, cursors)
  expect(state.$LayerCursor.innerHTML).toBe('<div class="EditorCursor" style="translate: 0px 10px;"></div>')
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
  const cursors = [10, 20]
  const spy = jest.spyOn(document, 'createElement')
  LayerCursor.setCursors(state, cursors)
  expect(state.$LayerCursor.innerHTML).toBe('<div class="EditorCursor" style="translate: 20px 10px;"></div>')
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
  const cursors = [10, 8]
  LayerCursor.setCursors(state, cursors)
  expect(state.$LayerCursor.innerHTML).toBe('<div class="EditorCursor" style="translate: 8px 10px;"></div>')
})
