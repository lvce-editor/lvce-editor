import * as QuickPickEntriesWorkspaceSymbol from '../src/parts/QuickPickEntriesWorkspaceSymbol/QuickPickEntriesWorkspaceSymbol.js'
import * as QuickPickReturnValue from '../src/parts/QuickPickReturnValue/QuickPickReturnValue.js'

test('name', () => {
  expect(QuickPickEntriesWorkspaceSymbol.name).toBe('workspace-symbol')
})

test('getPlaceholder', () => {
  expect(QuickPickEntriesWorkspaceSymbol.getPlaceholder()).toBe('')
})

test('getHelpEntries', () => {
  expect(QuickPickEntriesWorkspaceSymbol.getHelpEntries()).toEqual([])
})

test('getNoResults', () => {
  expect(QuickPickEntriesWorkspaceSymbol.getNoResults()).toEqual({
    label: 'no workspace symbols found',
  })
})

test('getPicks', async () => {
  await expect(QuickPickEntriesWorkspaceSymbol.getPicks()).resolves.toEqual([])
})

test('selectPick', async () => {
  expect(
    await QuickPickEntriesWorkspaceSymbol.selectPick({ label: 'test item 1' })
  ).toEqual({
    command: QuickPickReturnValue.Hide,
  })
})

test('getFilterValue', async () => {
  expect(QuickPickEntriesWorkspaceSymbol.getFilterValue('test item 1')).toBe(
    'test item 1'
  )
})
