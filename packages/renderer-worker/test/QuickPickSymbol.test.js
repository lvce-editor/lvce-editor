import * as QuickPickSymbol from '../src/parts/QuickPick/QuickPickSymbol.js'

test('name', () => {
  expect(QuickPickSymbol.name).toBe('symbol')
})

test('getPlaceholder', () => {
  expect(QuickPickSymbol.getPlaceholder()).toBe('')
})

test('getHelpEntries', () => {
  expect(QuickPickSymbol.getHelpEntries()).toEqual([])
})

test('getNoResults', () => {
  expect(QuickPickSymbol.getNoResults()).toEqual({
    label: 'No symbol found',
  })
})

test('getPicks', async () => {
  expect(await QuickPickSymbol.getPicks()).toEqual([])
})

test('selectPick', async () => {
  expect(await QuickPickSymbol.selectPick({ label: 'test item 1' })).toEqual({
    command: 'hide',
  })
})

test('getFilterValue', async () => {
  expect(QuickPickSymbol.getFilterValue('test item 1')).toBe('test item 1')
})
