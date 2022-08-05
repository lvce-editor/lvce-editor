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

test('setSelections - renderSelectionsEqual', () => {
  const $LayerSelections = createLayerSelection(1)
  console.log($LayerSelections.innerHTML)
  const state = {
    $LayerSelections,
  }
  const selections = new Uint32Array([
    /* top */ 10, /* left */ 0, /* width */ 27, /* height */ 20,
  ])
  const spy = jest.spyOn(document, 'createElement')
  LayerSelection.setSelections(state, selections)
  expect(state.$LayerSelections.innerHTML).toBe(
    '<div class="Selection" style="top: 10px; left: 0px; width: 27px; height: 20px;"></div>'
  )
  expect(spy).not.toHaveBeenCalled()
})

test('setCursor - renderSelectionsMore', () => {
  const state = {
    $LayerSelections: createLayerSelection(2),
  }
  const selections = new Uint32Array([
    /* top */ 10, /* left */ 0, /* width */ 27, /* height */ 20,
  ])
  const spy = jest.spyOn(document, 'createElement')
  LayerSelection.setSelections(state, selections)
  expect(state.$LayerSelections.innerHTML).toBe(
    '<div class="Selection" style="top: 10px; left: 0px; width: 27px; height: 20px;"></div>'
  )
  expect(spy).not.toHaveBeenCalled()
})
