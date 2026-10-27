import { expect, jest, test } from '@jest/globals'

const events: string[] = []
const create = jest.fn((..._args: readonly unknown[]) => ({}))
const getModuleId = jest.fn(async () => 'editor')
const getState = jest.fn(() => ({ pendingUid: 123 }))
const getLabel = jest.fn((uri: string) => uri)
const getTitle = jest.fn((uri: string) => uri)
const invoke = jest.fn(async (..._args: any[]) => undefined)
const focusIndex = jest.fn(async (state: unknown, _index: number) => ({ newState: state, commands: [] }))

jest.unstable_mockModule('../src/parts/Assert/Assert.ts', () => ({
  object: jest.fn(),
  string: jest.fn(),
}))
jest.unstable_mockModule('../src/parts/Command/Command.js', () => ({
  execute: jest.fn(async () => {
    events.push('leave-layout')
  }),
}))
jest.unstable_mockModule('../src/parts/EditorWorker/EditorWorker.ts', () => ({ invoke }))
jest.unstable_mockModule('../src/parts/Id/Id.js', () => ({ create: jest.fn(() => 123) }))
jest.unstable_mockModule('../src/parts/MeasureTabWidth/MeasureTabWidth.js', () => ({ measureTabWidth: jest.fn(() => 100) }))
jest.unstable_mockModule('../src/parts/PathDisplay/PathDisplay.js', () => ({ getLabel, getTitle, getFileIcon: jest.fn(async () => '') }))
jest.unstable_mockModule('../src/parts/ResolveInternalSourceUri/ResolveInternalSourceUri.ts', () => ({
  resolveInternalSourceUri: jest.fn(async (uri: string) => {
    events.push('resolve-uri')
    return uri
  }),
}))
jest.unstable_mockModule('../src/parts/Viewlet/Viewlet.js', () => ({ hideFunctional: jest.fn(() => []) }))
jest.unstable_mockModule('../src/parts/ViewletManager/ViewletManager.js', () => ({
  create,
  load: jest.fn(async () => []),
}))
jest.unstable_mockModule('../src/parts/ViewletMap/ViewletMap.js', () => ({ getModuleId }))
jest.unstable_mockModule('../src/parts/ViewletModuleId/ViewletModuleId.js', () => ({ EditorText: 'editor' }))
jest.unstable_mockModule('../src/parts/ViewletStates/ViewletStates.js', () => ({
  getState,
  hasInstance: jest.fn(() => false),
  setState: jest.fn(),
}))
jest.unstable_mockModule('../src/parts/ViewletMain/ViewletMainFocusIndex.js', () => ({ focusIndex }))

const ViewletMainOpenUri = await import('../src/parts/ViewletMain/ViewletMainOpenUri.ts')

for (const uri of ['app:///settings.json', 'app://keybindings']) {
  test(`restores the IDE layout before opening ${uri}`, async () => {
    events.length = 0
    create.mockClear()
    const state = {
      activeGroupIndex: 0,
      groups: [],
      height: 700,
      pendingUid: -1,
      tabHeight: 30,
      tabsUid: -1,
      uid: 1,
      width: 1000,
      x: 0,
      y: 0,
    }

    const result = await ViewletMainOpenUri.openUri(state, uri)

    expect(events).toEqual(['leave-layout', 'resolve-uri'])
    expect(create).toHaveBeenCalledWith(expect.anything(), 'editor', 1, uri, 0, 30, 1000, 670)
    expect(result.commands).toContainEqual(['Viewlet.append', 1, 123])
  })
}

test('applies a destination selection to the active editor', async () => {
  const editor = { opener: undefined, uid: 456, uri: 'file:///test.ts' }
  const state = {
    activeGroupIndex: 0,
    groups: [{ activeIndex: 0, editors: [editor] }],
    height: 700,
    tabHeight: 30,
    uid: 1,
    width: 1000,
    x: 0,
    y: 0,
  }

  await ViewletMainOpenUri.openUri(state, editor.uri, true, {
    startRowIndex: 3,
    startColumnIndex: 8,
    endRowIndex: 3,
    endColumnIndex: 8,
  })

  expect(invoke).toHaveBeenCalledWith('Editor.setSelections2', 456, new Uint32Array([3, 8, 3, 8]), true)
})

test('applies a destination selection after focusing an existing tab', async () => {
  const editor = { opener: undefined, uid: 456, uri: 'file:///test.ts' }
  const state = {
    activeGroupIndex: 0,
    groups: [{ activeIndex: -1, editors: [editor] }],
    height: 700,
    tabHeight: 30,
    uid: 1,
    width: 1000,
    x: 0,
    y: 0,
  }
  invoke.mockClear()
  focusIndex.mockClear()

  await ViewletMainOpenUri.openUri(state, editor.uri, true, {
    startRowIndex: 3,
    startColumnIndex: 8,
    endRowIndex: 3,
    endColumnIndex: 8,
  })

  expect(focusIndex).toHaveBeenCalledWith(state, 0)
  expect(invoke).toHaveBeenCalledWith('Editor.setSelections2', 456, new Uint32Array([3, 8, 3, 8]), true)
})
