import * as QuickPickEntriesNumber from '../src/parts/QuickPickEntriesNumber/QuickPickEntriesNumber.js'

test('name', () => {
  expect(QuickPickEntriesNumber.name).toBe('number')
})

test('getPlaceholder', () => {
  expect(QuickPickEntriesNumber.getPlaceholder()).toBe('')
})

test('getHelpEntries', () => {
  expect(QuickPickEntriesNumber.getHelpEntries()).toEqual([])
})

test('getNoResults', () => {
  expect(QuickPickEntriesNumber.getNoResults()).toEqual({
    label: 'No matching results',
  })
})

test('getPicks', async () => {
  expect(await QuickPickEntriesNumber.getPicks()).toEqual([
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
    {
      label: '7',
    },
    {
      label: '8',
    },
    {
      label: '9',
    },
    {
      label: '10',
    },
  ])
})

test('selectPick', async () => {
  expect(await QuickPickEntriesNumber.selectPick({ label: '1' })).toEqual({
    command: 'hide',
  })
})
