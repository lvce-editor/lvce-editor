/**
 * @jest-environment jsdom
 */
import { jest } from '@jest/globals'
import * as LayerScrollBar from '../src/parts/Editor/LayerScrollBar.js'

const create$ScrollBarDiagnostic = () => {
  const $ScrollBarDiagnostic = document.createElement('div')
  $ScrollBarDiagnostic.className = 'ScrollBarDiagnostic'
  return $ScrollBarDiagnostic
}

afterEach(() => {
  jest.restoreAllMocks()
})

test('setPosition', () => {
  const state = {
    $ScrollBarThumb: document.createElement('div'),
  }
  LayerScrollBar.setPosition(state, 50)
  expect(state.$ScrollBarThumb.style.top).toBe('50px')
})

test('setDiagnostics - renderScrollBarDiagnosticsLess', () => {
  const state = {
    $ScrollBarDiagnostics: document.createElement('div'),
  }
  const scrollBarDiagnostics = [
    {
      top: 20,
      height: 2,
    },
  ]
  const spy = jest.spyOn(document, 'createElement')
  LayerScrollBar.setDiagnostics(state, scrollBarDiagnostics)
  expect(state.$ScrollBarDiagnostics.innerHTML).toBe(
    '<div class="ScrollBarDiagnostic" style="top: 20px;"></div>'
  )
  expect(spy).toHaveBeenCalledTimes(1)
})

test('setDiagnostics - renderScrollBarDiagnosticsLess - single diagnostic already exists', () => {
  const state = {
    $ScrollBarDiagnostics: document.createElement('div'),
  }
  state.$ScrollBarDiagnostics.append(create$ScrollBarDiagnostic())
  const scrollBarDiagnostics = [
    {
      top: 20,
      height: 2,
    },
    {
      top: 40,
      height: 2,
    },
  ]
  const spy = jest.spyOn(document, 'createElement')
  LayerScrollBar.setDiagnostics(state, scrollBarDiagnostics)
  expect(state.$ScrollBarDiagnostics.innerHTML).toBe(
    '<div class="ScrollBarDiagnostic" style="top: 20px;"></div><div class="ScrollBarDiagnostic" style="top: 40px;"></div>'
  )
  expect(spy).toHaveBeenCalledTimes(1)
})

test('setDiagnostics - renderScrollBarDiagnosticsEqual', () => {
  const state = {
    $ScrollBarDiagnostics: document.createElement('div'),
  }
  state.$ScrollBarDiagnostics.append(create$ScrollBarDiagnostic())
  const scrollBarDiagnostics = [
    {
      top: 20,
      height: 2,
    },
  ]
  const spy = jest.spyOn(document, 'createElement')
  LayerScrollBar.setDiagnostics(state, scrollBarDiagnostics)
  expect(state.$ScrollBarDiagnostics.innerHTML).toBe(
    '<div class="ScrollBarDiagnostic" style="top: 20px;"></div>'
  )
  expect(spy).not.toHaveBeenCalled()
})

test('setDiagnostics - renderDiagnosticsMore', () => {
  const state = {
    $ScrollBarDiagnostics: document.createElement('div'),
  }
  state.$ScrollBarDiagnostics.append(create$ScrollBarDiagnostic())
  const scrollBarDiagnostics = []
  const spy = jest.spyOn(document, 'createElement')
  LayerScrollBar.setDiagnostics(state, scrollBarDiagnostics)
  expect(state.$ScrollBarDiagnostics.innerHTML).toBe('')
  expect(spy).not.toHaveBeenCalled()
})
