import * as QuickPickNumber from '../src/parts/QuickPick/QuickPickNumber.js'

test('name', () => {
  expect(QuickPickNumber.name).toBe('number')
})

test('getPlaceholder', () => {
  expect(QuickPickNumber.getPlaceholder()).toBe('')
})

test('getHelpEntries', () => {
  expect(QuickPickNumber.getHelpEntries()).toEqual([])
})

test('getNoResults', () => {
  expect(QuickPickNumber.getNoResults()).toEqual({
    label: 'No matching results',
  })
})

test('getPicks', async () => {
  expect(await QuickPickNumber.getPicks()).toEqual([
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
  expect(await QuickPickNumber.selectPick({ label: '1' })).toEqual({
    command: 'hide',
  })
})
