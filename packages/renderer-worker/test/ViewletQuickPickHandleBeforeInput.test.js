import { jest } from '@jest/globals'
import * as QuickPickReturnValue from '../src/parts/QuickPickReturnValue/QuickPickReturnValue.js'
import * as ViewletModuleId from '../src/parts/ViewletModuleId/ViewletModuleId.js'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/Viewlet/Viewlet.js', () => {
  return {
    closeWidget: jest.fn(() => {}),
  }
})

const ViewletQuickPick = await import('../src/parts/ViewletQuickPick/ViewletQuickPick.js')
const ViewletQuickPickHandleBeforeInput = await import('../src/parts/ViewletQuickPick/ViewletQuickPickHandleBeforeInput.js')
const ViewletManager = await import('../src/parts/ViewletManager/ViewletManager.js')

const render = (oldState, newState) => {
  return ViewletManager.render(ViewletQuickPick, oldState, newState, ViewletModuleId.QuickPick)
}

test('handleBeforeInput - insertText - at end', async () => {
  const state = {
    ...ViewletQuickPick.create(),
    value: 'ab',
    focusedIndex: 0,
    provider: {
      getPicks() {
        return []
      },
      getFilterValue(value) {
        return value
      },
    },
    filteredPicks: [],
  }
  expect(await ViewletQuickPickHandleBeforeInput.handleBeforeInput(state, 'insertText', 'c', 2, 2)).toMatchObject({
    value: 'abc',
    cursorOffset: 3,
  })
})

test('handleBeforeInput - insertText - at start', async () => {
  const state = {
    ...ViewletQuickPick.create(),
    value: 'bc',
    focusedIndex: 0,
    provider: {
      getPicks() {
        return []
      },
      getFilterValue(value) {
        return value
      },
    },
    filteredPicks: [],
  }
  expect(await ViewletQuickPickHandleBeforeInput.handleBeforeInput(state, 'insertText', 'a', 0, 0)).toMatchObject({
    value: 'abc',
    cursorOffset: 1,
  })
})

test('handleBeforeInput - deleteContentForward - at start', async () => {
  const state = {
    ...ViewletQuickPick.create(),
    value: 'abc',
    focusedIndex: 0,
    provider: {
      getPicks() {
        return []
      },
      getFilterValue(value) {
        return value
      },
    },
    filteredPicks: [],
  }
  expect(await ViewletQuickPickHandleBeforeInput.handleBeforeInput(state, 'deleteContentForward', null, 0, 0)).toMatchObject({
    value: 'bc',
    cursorOffset: 0,
  })
})

test('handleBeforeInput - deleteContentForward - in middle', async () => {
  const state = {
    ...ViewletQuickPick.create(),
    value: 'abc',
    focusedIndex: 0,
    provider: {
      getPicks() {
        return []
      },
      getFilterValue(value) {
        return value
      },
    },
    filteredPicks: [],
  }
  expect(await ViewletQuickPickHandleBeforeInput.handleBeforeInput(state, 'deleteContentForward', null, 1, 1)).toMatchObject({
    value: 'ac',
    cursorOffset: 1,
  })
})

test('handleBeforeInput - deleteContentBackward - at end', async () => {
  const state = {
    ...ViewletQuickPick.create(),
    value: 'abc',
    focusedIndex: 0,
    provider: {
      getPicks() {
        return []
      },
      getFilterValue(value) {
        return value
      },
    },
    filteredPicks: [],
  }
  expect(await ViewletQuickPickHandleBeforeInput.handleBeforeInput(state, 'deleteContentBackward', null, 3, 3)).toMatchObject({
    value: 'ab',
    cursorOffset: 2,
  })
})

test('handleBeforeInput - deleteWordBackward', async () => {
  const state = {
    ...ViewletQuickPick.create(),
    value: 'abc',
    focusedIndex: 0,
    provider: {
      getPicks() {
        return []
      },
      getFilterValue(value) {
        return value
      },
    },
    filteredPicks: [],
  }
  expect(await ViewletQuickPickHandleBeforeInput.handleBeforeInput(state, 'deleteWordBackward', null, 3, 3)).toMatchObject({
    value: '',
    cursorOffset: 0,
  })
})

test('handleBeforeInput - deleteWordForward', async () => {
  const state = {
    ...ViewletQuickPick.create(),
    value: 'abc',
    focusedIndex: 0,
    provider: {
      getPicks() {
        return []
      },
      getFilterValue(value) {
        return value
      },
    },
    filteredPicks: [],
  }
  expect(await ViewletQuickPickHandleBeforeInput.handleBeforeInput(state, 'deleteWordForward', null, 0, 0)).toMatchObject({
    value: '',
    cursorOffset: 0,
  })
})
