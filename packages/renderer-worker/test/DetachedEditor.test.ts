import { beforeEach, expect, jest, test } from '@jest/globals'
import * as ViewletModuleId from '../src/parts/ViewletModuleId/ViewletModuleId.js'
const invokeEditor = jest.fn<(...args: any[]) => Promise<any>>()
const invokeShared = jest.fn<(...args: any[]) => Promise<any>>()
const invokeCommand = jest.fn<(...args: any[]) => Promise<any>>()
const invokeMainArea = jest.fn<(...args: any[]) => Promise<any>>()
const instance = jest.fn<(...args: any[]) => any>()
jest.unstable_mockModule('../src/parts/Command/Command.js', () => ({ execute: invokeCommand }))
jest.unstable_mockModule('../src/parts/EditorWorker/EditorWorker.ts', () => ({ invoke: invokeEditor }))
jest.unstable_mockModule('../src/parts/MainAreaWorker/MainAreaWorker.js', () => ({ invoke: invokeMainArea }))
jest.unstable_mockModule('../src/parts/SharedProcess/SharedProcess.js', () => ({ invoke: invokeShared }))
jest.unstable_mockModule('../src/parts/GetWindowId/GetWindowId.js', () => ({ getWindowId: async () => 1 }))
jest.unstable_mockModule('../src/parts/ViewletStates/ViewletStates.js', () => ({ getInstance: instance }))
jest.unstable_mockModule('../src/parts/Viewlet/Viewlet.js', () => ({ executeViewletCommand: jest.fn() }))
jest.unstable_mockModule('../src/parts/Workspace/Workspace.js', () => ({ getWorkspaceUri: () => 'file:///workspace' }))
const { openNewWithEditorInput, openTransferredEditor } = await import('../src/parts/DetachedEditor/DetachedEditor.js')

beforeEach(() => {
  invokeEditor.mockReset()
  invokeShared.mockReset().mockResolvedValue(2)
  invokeCommand.mockReset().mockResolvedValue(undefined)
  invokeMainArea.mockReset()
  instance.mockReset()
})

test('non-text editor input passes through without attempting to read an editor buffer', async () => {
  instance.mockReturnValue({ moduleId: 'ExtensionView' })
  const input = { type: 'editor', uri: 'file:///snapshot.heapsnapshot' }
  await openNewWithEditorInput(input, 12, false)
  expect(invokeEditor).not.toHaveBeenCalled()
  expect(invokeShared).toHaveBeenCalledWith('ElectronWindow.openNewWithEditorInput', 1, {
    editorInput: input,
    workspaceUri: 'file:///workspace',
    isDirty: false,
  })
})

test('text editor input captures unsaved text and selections', async () => {
  instance.mockReturnValue({ moduleId: ViewletModuleId.EditorText })
  invokeEditor.mockImplementation(async (method) => (method === 'Editor.getText' ? 'unsaved text' : new Uint32Array([0, 1, 0, 4])))
  await openNewWithEditorInput({ type: 'editor', uri: 'untitled://1' }, 12, true)
  expect(invokeShared).toHaveBeenCalledWith('ElectronWindow.openNewWithEditorInput', 1, {
    editorInput: { type: 'editor', uri: 'untitled://1' },
    workspaceUri: 'file:///workspace',
    isDirty: true,
    text: 'unsaved text',
    selections: [0, 1, 0, 4],
  })
})

test('source edits during the transfer reject the move and close destination', async () => {
  instance.mockReturnValue({ moduleId: ViewletModuleId.EditorText })
  invokeEditor.mockResolvedValueOnce('before').mockResolvedValueOnce(new Uint32Array()).mockResolvedValueOnce('after')
  await expect(openNewWithEditorInput({ type: 'editor', uri: 'untitled://1' }, 12, true)).rejects.toThrow('changed during transfer')
  expect(invokeShared).toHaveBeenLastCalledWith('ElectronWindow.close', 2)
})

test.each(['loaded', 'binary', 3, 4])('accepts %s loading state when opening a transferred editor', async (loadingState) => {
  invokeShared.mockImplementation(async (command) => {
    if (command === 'ElectronWindow.takeEditorTransfer') {
      return { editorInput: { type: 'editor', uri: 'file:///workspace/file.txt' }, isDirty: false }
    }
    return undefined
  })
  invokeMainArea.mockResolvedValue({
    layout: {
      activeGroupId: 1,
      groups: [{ activeTabId: 2, id: 1, tabs: [{ editorUid: 20, id: 2, loadingState }] }],
    },
  })
  instance.mockReturnValue({ state: { uid: 10 } })

  await openTransferredEditor('https://lvce-oss.test/?editorTransfer=transfer-token')

  expect(invokeCommand).toHaveBeenCalledWith('Main.openInput', {
    editorInput: { type: 'editor', uri: 'file:///workspace/file.txt' },
    focus: true,
  })
  expect(invokeMainArea).toHaveBeenCalledWith('MainArea.getComponentState', 10)
  expect(invokeShared).toHaveBeenLastCalledWith('ElectronWindow.completeEditorTransfer', 1, 'transfer-token')
})
