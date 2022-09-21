import * as QuickPickEntriesSymbol from '../src/parts/QuickPickEntriesSymbol/QuickPickEntriesSymbol.js'

test('name', () => {
  expect(QuickPickEntriesSymbol.name).toBe('symbol')
})

test('getPlaceholder', () => {
  expect(QuickPickEntriesSymbol.getPlaceholder()).toBe('')
})

test('getHelpEntries', () => {
  expect(QuickPickEntriesSymbol.getHelpEntries()).toEqual([])
})

test('getNoResults', () => {
  expect(QuickPickEntriesSymbol.getNoResults()).toEqual({
    label: 'No symbol found',
  })
})

test('getPicks', async () => {
  expect(await QuickPickEntriesSymbol.getPicks()).toEqual([])
})

test('selectPick', async () => {
  expect(
    await QuickPickEntriesSymbol.selectPick({ label: 'test item 1' })
  ).toEqual({
    command: 'hide',
  })
})

test('getFilterValue', async () => {
  expect(QuickPickEntriesSymbol.getFilterValue('test item 1')).toBe(
    'test item 1'
  )
})
