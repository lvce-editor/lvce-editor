import { afterEach, beforeEach, expect, test } from '@jest/globals'
import * as ApplicationRegistry from '../src/parts/ApplicationRegistry/ApplicationRegistry.ts'
import * as ViewletStates from '../src/parts/ViewletStates/ViewletStates.js'

const addInstance = (uid: number, moduleId: string, applicationId: string): void => {
  ViewletStates.set(uid, {
    factory: {},
    moduleId,
    renderedState: { uid, applicationId },
    state: { uid, applicationId },
  })
}

beforeEach(() => {
  ViewletStates.reset()
  ApplicationRegistry.create({ id: 'source', layoutUid: 1, workspacePath: '', workspaceUri: '', href: '' })
  ApplicationRegistry.create({ id: 'preview', layoutUid: 2, workspacePath: '', workspaceUri: '', href: '' })
})

afterEach(() => {
  ViewletStates.reset()
  ApplicationRegistry.remove('source')
  ApplicationRegistry.remove('preview')
})

test('module lookup and legacy aliases cannot select the other application', () => {
  addInstance(1, 'Layout', 'source')
  addInstance(2, 'Layout', 'preview')
  ViewletStates.set('Layout', ViewletStates.getByUid(1))

  expect(ViewletStates.getInstance('Layout', 'preview')?.state.uid).toBe(2)
  expect(ViewletStates.getInstance(1, 'preview')).toBeUndefined()
  expect(ViewletStates.getInstance('Layout', 'missing')).toBeUndefined()
})

test('focus is tracked separately for each application and supports editor aliases', () => {
  addInstance(3, 'EditorText', 'source')
  addInstance(4, 'EditorText', 'source')
  addInstance(5, 'EditorText', 'preview')
  ViewletStates.setFocusedInstanceByType(4, 'EditorText')
  ViewletStates.setFocusedInstanceByType(5, 'EditorText')

  expect(ViewletStates.getInstance('Editor', 'source')?.state.uid).toBe(4)
  expect(ViewletStates.getInstance('Editor', 'preview')?.state.uid).toBe(5)
  ViewletStates.remove(4)
  expect(ViewletStates.getInstance('Editor', 'source')?.state.uid).toBe(3)
  expect(ViewletStates.getFocusedInstanceByType('EditorText', 'preview')).toBe(5)
})

test('rejects overwriting another application component with the same uid', () => {
  addInstance(3, 'Explorer', 'source')
  expect(() => addInstance(3, 'Explorer', 'preview')).toThrow('already belongs')
  expect(ViewletStates.getInstance(3, 'source')?.moduleId).toBe('Explorer')
})
