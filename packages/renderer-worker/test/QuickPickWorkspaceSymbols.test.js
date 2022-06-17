import * as QuickPickWorkspaceSymbol from '../src/parts/QuickPick/QuickPickWorkspaceSymbol.js'

test('name', () => {
  expect(QuickPickWorkspaceSymbol.name).toBe('workspace-symbol')
})

test('getPlaceholder', () => {
  expect(QuickPickWorkspaceSymbol.getPlaceholder()).toBe('')
})

test('getHelpEntries', () => {
  expect(QuickPickWorkspaceSymbol.getHelpEntries()).toEqual([])
})

test('getNoResults', () => {
  expect(QuickPickWorkspaceSymbol.getNoResults()).toEqual({
    label: 'no workspace symbols found',
  })
})

test('getPicks', async () => {
  await expect(QuickPickWorkspaceSymbol.getPicks()).resolves.toEqual([])
})

test('selectPick', async () => {
  expect(
    await QuickPickWorkspaceSymbol.selectPick({ label: 'test item 1' })
  ).toEqual({
    command: 'hide',
  })
})

test('getFilterValue', async () => {
  expect(QuickPickWorkspaceSymbol.getFilterValue('test item 1')).toBe(
    'test item 1'
  )
})
