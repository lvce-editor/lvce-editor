import * as ViewletQuickPick from '../src/parts/ViewletQuickPick/ViewletQuickPick.js'

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
