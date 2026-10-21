import { afterEach, beforeEach, expect, test } from '@jest/globals'
import * as ApplicationRegistry from '../src/parts/ApplicationRegistry/ApplicationRegistry.ts'
import { getMainAreaUid } from '../src/parts/GetMainAreaUid/GetMainAreaUid.ts'
import * as ViewletStates from '../src/parts/ViewletStates/ViewletStates.js'

beforeEach(() => {
  ViewletStates.reset()
  ApplicationRegistry.create({ href: '', id: 'source', layoutUid: 1, workspacePath: '', workspaceUri: '' })
  ApplicationRegistry.create({ href: '', id: 'preview', layoutUid: 21, workspacePath: '', workspaceUri: '' })
  ApplicationRegistry.own('source', 8)
  ApplicationRegistry.own('preview', 28)
})

afterEach(async () => {
  ViewletStates.reset()
  await ApplicationRegistry.remove('source')
  await ApplicationRegistry.remove('preview')
})

const addMainArea = (uid: number, applicationId: string): void => {
  ViewletStates.set(uid, {
    factory: {},
    moduleId: 'Main',
    renderedState: { uid },
    state: { applicationId, uid },
  })
}

test('resolves the MainArea in the requesting component application', () => {
  addMainArea(4, 'source')
  addMainArea(24, 'preview')
  expect(getMainAreaUid(8)).toBe(4)
  expect(getMainAreaUid(28)).toBe(24)
})

test('does not fall back to another application for an unowned component', () => {
  addMainArea(4, 'source')
  expect(getMainAreaUid(99)).toBeUndefined()
})

test('returns undefined when the owning application has no MainArea', () => {
  addMainArea(24, 'preview')
  expect(getMainAreaUid(8)).toBeUndefined()
})
