/**
 * @jest-environment jsdom
 */
import { jest } from '@jest/globals'
import * as LayerSelection from '../src/parts/Editor/LayerSelections.js'

afterEach(() => {
  jest.restoreAllMocks()
})

const createLayerSelection = (childCount) => {
  const $LayerSelection = document.createElement('div')
  for (let i = 0; i < childCount; i++) {
    const $Selection = document.createElement('div')
    $Selection.className = 'Selection'
    $LayerSelection.append($Selection)
  }
  return $LayerSelection
}

test('setSelections - renderSelectionsLess', () => {
  const $LayerSelections = createLayerSelection(1)
  const state = {
    $LayerSelections,
  }
  const selections = [
    /* x */ '0px',
    /* y */ '10px',
    /* width */ '27px',
    /* height */ '20px',
    /*  */ /* x */ '0px',
    /* y */ '10px',
    /* width */ '27px',
    /* height */ '20px',
  ]
  const spy = jest.spyOn(document, 'createElement')
  LayerSelection.setSelections(state, selections)
  expect(state.$LayerSelections.innerHTML).toBe(
    '<div class="Selection" style="top: 10px; left: 0px; width: 27px; height: 20px;"></div><div class="EditorSelection" style="top: 10px; left: 0px; width: 27px; height: 20px;"></div>',
  )
  expect(spy).toHaveBeenCalledTimes(1)
})

test('setSelections - renderSelectionsEqual', () => {
  const $LayerSelections = createLayerSelection(1)
  const state = {
    $LayerSelections,
  }
  const selections = [/* x */ '0px', /* y */ '10px', /* width */ '27px', /* height */ '20px']
  const spy = jest.spyOn(document, 'createElement')
  LayerSelection.setSelections(state, selections)
  expect(state.$LayerSelections.innerHTML).toBe('<div class="Selection" style="top: 10px; left: 0px; width: 27px; height: 20px;"></div>')
  expect(spy).not.toHaveBeenCalled()
})

test('setCursor - renderSelectionsMore', () => {
  const state = {
    $LayerSelections: createLayerSelection(2),
  }
  const selections = [/* x */ '0px', /* y */ '10px', /* width */ '27px', /* height */ '20px']
  const spy = jest.spyOn(document, 'createElement')
  LayerSelection.setSelections(state, selections)
  expect(state.$LayerSelections.innerHTML).toBe('<div class="Selection" style="top: 10px; left: 0px; width: 27px; height: 20px;"></div>')
  expect(spy).not.toHaveBeenCalled()
})
