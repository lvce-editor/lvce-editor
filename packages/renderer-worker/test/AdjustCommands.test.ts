import { expect, test } from '@jest/globals'
import * as AdjustCommands from '../src/parts/AdjustCommands/AdjustCommands.js'

test.each([
  'Viewlet.setAdditionalFocus',
  'Viewlet.setFocusContext',
  'Viewlet.unsetAdditionalFocus',
])('adds the viewlet uid to a legacy %s command', (method) => {
  const oldState = {}
  const newState = {
    commands: [[method, 10]],
    uid: 20,
  }

  expect(AdjustCommands.apply(oldState, newState)).toEqual([[method, 20, 10]])
  expect(newState.commands).toEqual([])
})

test('preserves a targeted focus context command', () => {
  const oldState = {}
  const newState = {
    commands: [['Viewlet.setFocusContext', 20, 10]],
    uid: 30,
  }

  expect(AdjustCommands.apply(oldState, newState)).toEqual([
    ['Viewlet.setFocusContext', 20, 10],
  ])
  expect(newState.commands).toEqual([])
})
