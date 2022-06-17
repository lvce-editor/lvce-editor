import * as QuickPickGoToLine from '../src/parts/QuickPick/QuickPickGoToLine.js'

test('name', () => {
  expect(QuickPickGoToLine.name).toBe('goToLine')
})

test('getPlaceholder', () => {
  expect(QuickPickGoToLine.getPlaceholder()).toBe('')
})

test('getHelpEntries', () => {
  expect(QuickPickGoToLine.getHelpEntries()).toEqual([])
})

test('getNoResults', () => {
  expect(QuickPickGoToLine.getNoResults()).toEqual(undefined)
})

test('getPicks', async () => {
  expect(await QuickPickGoToLine.getPicks()).toEqual([
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
  expect(await QuickPickGoToLine.selectPick({ label: 'test item 1' })).toEqual({
    command: 'hide',
  })
})
