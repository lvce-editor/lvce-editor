import * as QuickPickNoop from '../src/parts/QuickPick/QuickPickNoop.js'

test('name', () => {
  expect(QuickPickNoop.name).toBe('noop')
})

test('getPlaceholder', () => {
  expect(QuickPickNoop.getPlaceholder()).toBe('')
})

test('getHelpEntries', () => {
  expect(QuickPickNoop.getHelpEntries()).toEqual([])
})

test('getNoResults', () => {
  expect(QuickPickNoop.getNoResults()).toEqual('No Results')
})

test('getPicks', async () => {
  expect(await QuickPickNoop.getPicks()).toEqual([])
})

test('selectPick', async () => {
  expect(await QuickPickNoop.selectPick({ label: '1' })).toEqual({
    command: 'hide',
  })
})
