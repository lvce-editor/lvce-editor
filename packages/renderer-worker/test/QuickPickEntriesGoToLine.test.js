import * as QuickPickEntriesGoToLine from '../src/parts/QuickPickEntriesGoToLine/QuickPickEntriesGoToLine.js'

test('name', () => {
  expect(QuickPickEntriesGoToLine.name).toBe('goToLine')
})

test('getPlaceholder', () => {
  expect(QuickPickEntriesGoToLine.getPlaceholder()).toBe('')
})

test('getHelpEntries', () => {
  expect(QuickPickEntriesGoToLine.getHelpEntries()).toEqual([])
})

test('getNoResults', () => {
  expect(QuickPickEntriesGoToLine.getNoResults()).toEqual(undefined)
})

test('getPicks', async () => {
  expect(await QuickPickEntriesGoToLine.getPicks()).toEqual([
    {
      label: '1',
    },
    {
      label: '2',
    },
    {
      label: '3',
    },
    {
      label: '4',
    },
    {
      label: '5',
    },
    {
      label: '6',
    },
  ])
})

test.skip('selectPick', async () => {
  expect(
    await QuickPickEntriesGoToLine.selectPick({ label: 'test item 1' })
  ).toEqual({
    command: 'hide',
  })
})
