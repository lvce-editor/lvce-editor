import { afterEach, expect, jest, test } from '@jest/globals'
import * as ApplicationRegistry from '../src/parts/ApplicationRegistry/ApplicationRegistry.ts'

const invoke = jest.fn<(...args: readonly unknown[]) => Promise<void>>(async () => {})
jest.unstable_mockModule('../src/parts/RendererProcess/RendererProcess.js', () => ({ invoke }))
const executeForApplication = jest.fn<(...args: readonly unknown[]) => Promise<void>>(async () => {})
jest.unstable_mockModule('../src/parts/ViewletManager/ViewletManager.js', () => ({ executeForApplication }))
const EditorKeymap = await import('../src/parts/EditorKeymap/EditorKeymap.ts')

afterEach(async () => {
  await EditorKeymap.dispose('preview')
  await ApplicationRegistry.remove('preview')
  jest.clearAllMocks()
})

test('registers in its own workbench and routes commands to that application', async () => {
  ApplicationRegistry.create({ id: 'preview', layoutUid: 10, href: '', workspaceUri: '', workspacePath: '' })
  const keymap = { initialMode: 'normal', modes: { normal: { bindings: {} } } }
  const id = await EditorKeymap.register(keymap, 'preview')
  expect(invoke).toHaveBeenCalledWith('EditorKeymap.register', 'Workbench-10', id, keymap)
  await EditorKeymap.execute(id, 'Editor.cursorDown')
  expect(executeForApplication).toHaveBeenCalledWith('preview', 'Editor.cursorDown')
  await EditorKeymap.remove(id, 'another-application')
  await EditorKeymap.execute(id, 'Editor.cursorUp')
  expect(executeForApplication).toHaveBeenCalledTimes(2)
  await EditorKeymap.dispose('preview')
  expect(invoke).toHaveBeenCalledWith('EditorKeymap.remove', 'Workbench-10', id)
  await EditorKeymap.execute(id, 'Editor.cursorUp')
  expect(executeForApplication).toHaveBeenCalledTimes(2)
})

test('closed applications do not execute queued key commands', async () => {
  ApplicationRegistry.create({ id: 'preview', layoutUid: 10, href: '', workspaceUri: '', workspacePath: '' })
  const id = await EditorKeymap.register({}, 'preview')
  ApplicationRegistry.close('preview')
  await EditorKeymap.execute(id, 'Editor.cursorDown')
  expect(executeForApplication).not.toHaveBeenCalled()
})
