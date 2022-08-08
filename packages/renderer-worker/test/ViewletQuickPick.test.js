import * as ViewletQuickPick from '../src/parts/ViewletQuickPick/ViewletQuickPick.js'
import { jest } from '@jest/globals'

test('name', () => {
  expect(ViewletQuickPick.name).toBe('QuickPick')
})

test('create', () => {
  expect(ViewletQuickPick.create()).toBeDefined()
})

test('focusFirst', async () => {
  const state = {
    ...ViewletQuickPick.create(),
    focusedIndex: 3,
    provider: {},
  }
  expect(await ViewletQuickPick.focusFirst(state)).toMatchObject({
    focusedIndex: 0,
  })
})

test('focusLast', async () => {
  const state = {
    ...ViewletQuickPick.create(),
    focusedIndex: 0,
    provider: {},
    filteredPicks: [{ label: '1' }, { label: '2' }, { label: '3' }],
  }
  expect(await ViewletQuickPick.focusLast(state)).toMatchObject({
    focusedIndex: 2,
  })
})

test('focusPrevious', async () => {
  const state = {
    ...ViewletQuickPick.create(),
    focusedIndex: 2,
    provider: {},
    filteredPicks: [{ label: '1' }, { label: '2' }, { label: '3' }],
  }
  expect(await ViewletQuickPick.focusPrevious(state)).toMatchObject({
    focusedIndex: 1,
  })
})

test('focusNext', async () => {
  const state = {
    ...ViewletQuickPick.create(),
    focusedIndex: 0,
    provider: {},
    filteredPicks: [{ label: '1' }, { label: '2' }, { label: '3' }],
  }
  expect(await ViewletQuickPick.focusNext(state)).toMatchObject({
    focusedIndex: 1,
  })
})

test('handleInput - same value', async () => {
  const state = {
    ...ViewletQuickPick.create(),
    value: 'test',
    focusedIndex: 0,
    provider: {
      getPicks: jest.fn(() => []),
      getFilterValue(value) {
        return value
      },
    },
    filteredPicks: [{ label: '1' }, { label: '2' }, { label: '3' }],
  }
  expect(await ViewletQuickPick.handleInput(state, 'test')).toBe(state)
  expect(state.provider.getPicks).not.toHaveBeenCalled()
})

test('handleInput - different value', async () => {
  const state = {
    ...ViewletQuickPick.create(),
    value: 'test',
    focusedIndex: 0,
    provider: {
      getPicks: jest.fn(() => []),
      getFilterValue(value) {
        return value
      },
    },
    filteredPicks: [{ label: '1' }, { label: '2' }, { label: '3' }],
  }
  expect(await ViewletQuickPick.handleInput(state, 'abc')).toMatchObject({
    filteredPicks: [],
  })
  expect(state.provider.getPicks).toHaveBeenCalledTimes(1)
  expect(state.provider.getPicks).toHaveBeenCalledWith('abc')
})

test('handleBeforeInput - one letter added at end', async () => {
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
    filteredPicks: [{ label: '1' }, { label: '2' }, { label: '3' }],
  }
  expect(
    await ViewletQuickPick.handleBeforeInput(state, 'insertText', 'c', 2, 2)
  ).toMatchObject({
    value: 'abc',
  })
})

test('handleBeforeInput - one letter added at start', async () => {
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
    filteredPicks: [{ label: '1' }, { label: '2' }, { label: '3' }],
  }
  expect(
    await ViewletQuickPick.handleBeforeInput(state, 'insertText', 'a', 0, 0)
  ).toMatchObject({
    value: 'abc',
  })
})
