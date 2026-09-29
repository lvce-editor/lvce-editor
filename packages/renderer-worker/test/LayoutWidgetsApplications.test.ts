import { afterEach, beforeEach, expect, test } from '@jest/globals'
import * as ApplicationRegistry from '../src/parts/ApplicationRegistry/ApplicationRegistry.ts'
import * as LayoutWidgets from '../src/parts/LayoutWidgets/LayoutWidgets.ts'
import * as ViewletLayout from '../src/parts/ViewletLayout/ViewletLayout.ts'
import * as ViewletStates from '../src/parts/ViewletStates/ViewletStates.js'
import { getLayoutVirtualDom } from '../src/parts/GetLayoutVirtualDom/GetLayoutVirtualDom.ts'

const createLayout = (applicationId: string, uid: number): void => {
  ApplicationRegistry.create({ id: applicationId, layoutUid: uid, workspacePath: '', workspaceUri: '', href: '' })
  const state = { ...ViewletLayout.create(uid), applicationId }
  ViewletStates.set(uid, { state, renderedState: state, moduleId: 'Layout', factory: {} })
}

beforeEach(() => {
  ViewletStates.reset()
  createLayout('source', 1)
  createLayout('preview', 2)
  ApplicationRegistry.own('source', 10)
  ApplicationRegistry.own('preview', 11)
})

afterEach(() => {
  ViewletStates.reset()
  ApplicationRegistry.remove('source')
  ApplicationRegistry.remove('preview')
})

test('application workbenches have distinct DOM ids', () => {
  expect(getLayoutVirtualDom(ViewletStates.getState(1))[0].id).toBe('Workbench-1')
  expect(getLayoutVirtualDom(ViewletStates.getState(2))[0].id).toBe('Workbench-2')
})

test('routes mixed widget batches to their owning layout', () => {
  const commands = LayoutWidgets.reconcile([
    ['Viewlet.createFunctionalRoot', 'FindWidget', 20, true],
    ['Viewlet.createFunctionalRoot', 'FindWidget', 21, true],
    ['Viewlet.setWidgets', 10, 1, [20]],
    ['Viewlet.setWidgets', 11, 1, [21]],
  ])

  expect(ViewletStates.getState(1).widgetReferences).toEqual([{ parentUid: 10, uid: 20 }])
  expect(ViewletStates.getState(2).widgetReferences).toEqual([{ parentUid: 11, uid: 21 }])
  expect(ApplicationRegistry.getOwner(20)).toBe('source')
  expect(ApplicationRegistry.getOwner(21)).toBe('preview')
  expect(
    commands
      .filter((command) => command[0] === 'Viewlet.setDom2')
      .map((command) => command[1])
      .sort(),
  ).toEqual([1, 2])

  const disposeCommands = LayoutWidgets.removeOwnedWidgets(11)
  expect(disposeCommands).toContainEqual(['Viewlet.dispose', 21])
  expect(disposeCommands).not.toContainEqual(['Viewlet.dispose', 20])
  expect(ViewletStates.getState(1).widgetReferences).toEqual([{ parentUid: 10, uid: 20 }])
})

test('resolves nested declarations even when the child declaration comes first', () => {
  LayoutWidgets.reconcile([
    ['Viewlet.setWidgets', 20, 1, [30]],
    ['Viewlet.setWidgets', 10, 1, [20]],
  ])

  expect(ApplicationRegistry.getOwner(20)).toBe('source')
  expect(ApplicationRegistry.getOwner(30)).toBe('source')
  expect(ViewletStates.getState(2).widgetReferences).toEqual([])
})

test('rejects cross-application widget reuse before updating either layout', () => {
  expect(() =>
    LayoutWidgets.reconcile([
      ['Viewlet.setWidgets', 10, 1, [30]],
      ['Viewlet.setWidgets', 11, 1, [10]],
    ]),
  ).toThrow('already belongs to application source')
  expect(ViewletStates.getState(1).widgetReferences).toEqual([])
  expect(ViewletStates.getState(2).widgetReferences).toEqual([])
})

test('rejects a new uid claimed by both applications in the same batch', () => {
  expect(() =>
    LayoutWidgets.reconcile([
      ['Viewlet.setWidgets', 10, 1, [30]],
      ['Viewlet.setWidgets', 11, 1, [30]],
    ]),
  ).toThrow('declared by multiple applications')
  expect(ViewletStates.getState(1).widgetReferences).toEqual([])
  expect(ViewletStates.getState(2).widgetReferences).toEqual([])
  expect(ApplicationRegistry.getOwner(30)).toBeUndefined()
})
