import { beforeEach, expect, jest, test } from '@jest/globals'
import * as LayoutWidgets from '../src/parts/LayoutWidgets/LayoutWidgets.ts'
import * as ViewletLayout from '../src/parts/ViewletLayout/ViewletLayout.ts'
import * as ViewletStates from '../src/parts/ViewletStates/ViewletStates.js'

const createLayout = () => {
  const state = ViewletLayout.create(1)
  ViewletStates.set(1, {
    state,
    renderedState: state,
    moduleId: 'Layout',
    factory: {},
  })
  ViewletStates.set('Layout', ViewletStates.getInstance(1))
  return state
}

beforeEach(() => {
  ViewletStates.reset()
})

test('setWidgets declares the complete widget set and is idempotent', () => {
  const state = ViewletLayout.create(1)
  const first = LayoutWidgets.setWidgets(state, 10, 1, [20, 21])
  const second = LayoutWidgets.setWidgets(first.newState, 10, 1, [20, 21])

  expect(first.accepted).toBe(true)
  expect(first.newState.widgetReferences).toEqual([
    { parentUid: 10, uid: 20 },
    { parentUid: 10, uid: 21 },
  ])
  expect(second).toEqual({
    accepted: true,
    newState: first.newState,
    removedUids: [],
  })
})

test('setWidgets replaces widgets and rejects stale revisions', () => {
  const state = ViewletLayout.create(1)
  const first = LayoutWidgets.setWidgets(state, 10, 2, [20, 21])
  const replacement = LayoutWidgets.setWidgets(first.newState, 10, 3, [22])
  const stale = LayoutWidgets.setWidgets(replacement.newState, 10, 2, [23])

  expect(replacement.removedUids).toEqual([20, 21])
  expect(replacement.newState.widgetReferences).toEqual([{ parentUid: 10, uid: 22 }])
  expect(stale.accepted).toBe(false)
  expect(stale.newState).toBe(replacement.newState)
})

test('setWidgets recursively removes widgets owned by a removed widget', () => {
  const state = ViewletLayout.create(1)
  const parent = LayoutWidgets.setWidgets(state, 10, 1, [20])
  const child = LayoutWidgets.setWidgets(parent.newState, 20, 1, [30])
  const replacement = LayoutWidgets.setWidgets(child.newState, 10, 2, [21])

  expect(replacement.removedUids).toEqual([20, 30])
  expect(replacement.newState.widgetReferences).toEqual([{ parentUid: 10, uid: 21 }])
})

test('reconcile creates and populates widgets before Layout references them, then focuses', () => {
  createLayout()
  const commands = LayoutWidgets.reconcile([
    ['Viewlet.focusSelector', 20, '.Input'],
    ['Viewlet.createFunctionalRoot', 'FindWidget', 20, true],
    ['Viewlet.setDom2', 20, [{ type: 1, childCount: 0 }]],
    ['Viewlet.setWidgets', 10, 1, [20]],
  ])

  expect(commands.map((command) => command[0])).toEqual([
    'Viewlet.createFunctionalRoot',
    'Viewlet.setDom2',
    'Viewlet.setDom2',
    'Viewlet.focusSelector',
  ])
  expect(commands[2][1]).toBe(1)
  expect(ViewletStates.getState('Layout').widgetReferences).toEqual([{ parentUid: 10, uid: 20 }])
})

test('reconcile removes Layout references before disposing closed widgets', () => {
  const state = createLayout()
  const declared = LayoutWidgets.setWidgets(state, 10, 1, [20])
  ViewletStates.setState('Layout', declared.newState)
  ViewletStates.setRenderedState('Layout', declared.newState)

  const commands = LayoutWidgets.reconcile([['Viewlet.setWidgets', 10, 2, []]])

  expect(commands.map((command) => command[0])).toEqual(['Viewlet.setDom2', 'Viewlet.dispose'])
  expect(commands[1]).toEqual(['Viewlet.dispose', 20])
})

test('reconcile disposes roots created by a stale declaration', () => {
  const state = createLayout()
  const declared = LayoutWidgets.setWidgets(state, 10, 3, [])
  ViewletStates.setState('Layout', declared.newState)
  ViewletStates.setRenderedState('Layout', declared.newState)
  const dispose = jest.fn()
  ViewletStates.set(20, {
    state: { uid: 20 },
    renderedState: { uid: 20 },
    moduleId: 'FindWidget',
    factory: { dispose },
  })

  const commands = LayoutWidgets.reconcile([
    ['Viewlet.createFunctionalRoot', 'FindWidget', 20, true],
    ['Viewlet.setDom2', 20, []],
    ['Viewlet.setWidgets', 10, 2, [20]],
  ])

  expect(commands).toEqual([['Viewlet.dispose', 20]])
  expect(dispose).toHaveBeenCalledWith({ uid: 20 })
  expect(ViewletStates.getInstance(20)).toBeUndefined()
})

test('reconcile ignores stale updates to a registered widget', () => {
  const state = createLayout()
  const declared = LayoutWidgets.setWidgets(state, 10, 3, [20])
  ViewletStates.setState('Layout', declared.newState)
  ViewletStates.setRenderedState('Layout', declared.newState)

  const commands = LayoutWidgets.reconcile([
    ['Viewlet.setDom2', 20, [{ text: 'stale' }]],
    ['Viewlet.focusSelector', 20, '.Input'],
    ['Viewlet.setWidgets', 10, 2, [20]],
  ])

  expect(commands).toEqual([])
  expect(ViewletStates.getState('Layout').widgetReferences).toEqual([{ parentUid: 10, uid: 20 }])
})

test('removeWidgets recursively disposes registered descendants and rejects resurrection', () => {
  const state = ViewletLayout.create(1)
  const parent = LayoutWidgets.setWidgets(state, 10, 1, [20])
  const child = LayoutWidgets.setWidgets(parent.newState, 20, 1, [30])
  const removed = LayoutWidgets.removeWidgets(child.newState, 10)
  const stale = LayoutWidgets.setWidgets(removed.newState, 10, 2, [40])

  expect(removed.removedUids).toEqual([20, 30])
  expect(removed.newState.widgetReferences).toEqual([])
  expect(stale.accepted).toBe(false)
})
