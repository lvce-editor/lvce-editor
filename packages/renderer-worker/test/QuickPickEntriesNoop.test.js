import * as QuickPickEntriesNoop from '../src/parts/QuickPickEntriesNoop/QuickPickNoop.js'

test('name', () => {
  expect(QuickPickEntriesNoop.name).toBe('noop')
})

test('getPlaceholder', () => {
  expect(QuickPickEntriesNoop.getPlaceholder()).toBe('')
})

test('getHelpEntries', () => {
  expect(QuickPickEntriesNoop.getHelpEntries()).toEqual([])
})

test('getNoResults', () => {
  expect(QuickPickEntriesNoop.getNoResults()).toEqual('No Results')
})

test('getPicks', async () => {
  expect(await QuickPickEntriesNoop.getPicks()).toEqual([])
})

test('selectPick', async () => {
  expect(await QuickPickEntriesNoop.selectPick({ label: '1' })).toEqual({
    command: 'hide',
  })
})
