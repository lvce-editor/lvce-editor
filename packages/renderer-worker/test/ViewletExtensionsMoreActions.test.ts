import { expect, jest, test } from '@jest/globals'

jest.unstable_mockModule('../src/parts/ContextMenu/ContextMenu.js', () => ({
  show2Below: jest.fn(),
}))

const ContextMenu = await import('../src/parts/ContextMenu/ContextMenu.js')
const MoreActions = await import('../src/parts/ViewletExtensions/ViewletExtensionsMoreActions.js')
const Actions = await import('../src/parts/ViewletExtensions/ViewletExtensionsActions.js')
const GetActionsVirtualDom = await import('../src/parts/GetActionsVirtualDom/GetActionsVirtualDom.js')

test('toolbar ellipsis dispatches the registered menu event', () => {
  const dom = GetActionsVirtualDom.getActionsVirtualDom(Actions.getActions())
  expect(dom).toContainEqual(expect.objectContaining({ title: 'More Actions', onClick: MoreActions.eventListener.name }))
  expect(MoreActions.eventListener.params).toEqual(['showMoreActions'])
})

test('opens the menu below the title bar for either sidebar position', async () => {
  const state = { uid: 42, x: 900, y: 80, width: 300 }
  expect(await MoreActions.showMoreActions(state)).toBe(state)
  expect(ContextMenu.show2Below).toHaveBeenCalledWith(42, MoreActions.id, 1172, 80)
})

test('running extensions uses the existing application URI command', () => {
  expect(MoreActions.getMenuEntries()).toEqual([
    expect.objectContaining({ label: 'Show Running Extensions', command: 'Main.openUri', args: ['running-extensions://'], flags: 0 }),
  ])
})
