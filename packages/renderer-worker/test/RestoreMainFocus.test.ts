import { beforeEach, expect, jest, test } from '@jest/globals'
import { restoreMainFocus } from '../src/parts/RestoreMainFocus/RestoreMainFocus.js'
import * as ViewletStates from '../src/parts/ViewletStates/ViewletStates.js'

beforeEach(() => {
  ViewletStates.reset()
})

test('restoreMainFocus focuses the active main-area editor', async () => {
  const invoke = jest.fn(async (_method: string, _uid: number) => {})
  ViewletStates.set(3, {
    factory: {},
    moduleId: 'Main',
    renderedState: { uid: 3 },
    state: { uid: 3 },
  })

  await restoreMainFocus(invoke)

  expect(invoke).toHaveBeenCalledWith('MainArea.focus', 3)
})

test('restoreMainFocus does nothing without a main-area instance', async () => {
  const invoke = jest.fn(async () => {})

  await restoreMainFocus(invoke)

  expect(invoke).not.toHaveBeenCalled()
})
