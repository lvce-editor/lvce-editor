import { expect, jest, test } from '@jest/globals'
const saveViewletState = jest.fn(async (_uid) => {})
jest.unstable_mockModule('../src/parts/SaveState/SaveState.js', () => ({ saveViewletState }))
const SaveState = await import('../src/parts/SaveState/SaveState.js')
const WorkerViewletAdapterMain = await import('../src/parts/WorkerViewletAdapterMain/WorkerViewletAdapterMain.js')

test('hot reload snapshots the live main area layout with the hot reload marker', async () => {
  const state = { uid: 1 }
  const layout = {
    groups: [{ activeTabId: 1, tabs: [{ editorInput: { type: 'editor' }, editorUid: 7, id: 1, uri: 'untitled://1' }] }],
  }
  const invoke = jest.fn(async (_command, _uid) => ({ layout }))

  const result = await WorkerViewletAdapterMain.getHotReloadSavedState(state, undefined, { invoke })

  expect(invoke).toHaveBeenCalledWith('MainArea.getComponentState', state.uid)
  expect(SaveState.saveViewletState).toHaveBeenCalledWith(7)
  expect(result).toEqual({ layout, hotReload: true })
})

test('hotReload loads the full saved layout instead of the startup shell', async () => {
  const state = { uid: 1 }
  const layout = { groups: [{ activeTabId: 1, tabs: [{ editorInput: { type: 'editor' }, editorUid: 7, id: 1, uri: 'untitled://1' }] }] }
  const invoke = jest.fn(async (_command, _uid) => ({ layout }))
  const loadContentForHotReload = jest.fn(async (_state, _savedState) => state)
  const module = WorkerViewletAdapterMain.extendModule({ loadContentForHotReload }, { worker: { invoke } })

  await module.hotReload(state)

  expect(loadContentForHotReload).toHaveBeenCalledWith(state, { layout, hotReload: true })
})
