import { afterEach, beforeEach, expect, jest, test } from '@jest/globals'
import * as ApplicationRegistry from '../src/parts/ApplicationRegistry/ApplicationRegistry.ts'
import { applyOpenTextDocumentEditWithInvoke, getOpenTextDocumentWithInvoke } from '../src/parts/GetActiveEditor/GetActiveEditor.js'

beforeEach(() => {
  ApplicationRegistry.create({ href: '/', id: 'chat-source', layoutUid: 501, workspacePath: '/project', workspaceUri: 'memfs:///project/' })
  ApplicationRegistry.create({ href: '/', id: 'chat-preview', layoutUid: 502, workspacePath: '/project', workspaceUri: 'memfs:///project/' })
  ApplicationRegistry.own('chat-source', 41)
  ApplicationRegistry.own('chat-preview', 42)
})

afterEach(async () => {
  await ApplicationRegistry.remove('chat-source')
  await ApplicationRegistry.remove('chat-preview')
})

const createInvoke = (): ReturnType<typeof jest.fn<(method: string, id?: number) => Promise<unknown>>> =>
  jest.fn(async (method: string, id?: number) => {
    if (method === 'Editor.getKeys') {
      return ['42', '41']
    }
    if (method === 'Editor.getComponentState') {
      return {
        applicationId: id === 41 ? 'chat-source' : 'chat-preview',
        lines: [id === 41 ? 'source unsaved' : 'other application secret'],
        modified: true,
        uri: 'memfs:///project/auth.ts',
      }
    }
    return undefined
  })

test('reads the unsaved buffer from the requesting application, including inactive editors', async () => {
  const invoke = createInvoke()
  await expect(getOpenTextDocumentWithInvoke(invoke, 'memfs:///project/auth.ts', 'chat-source')).resolves.toEqual({
    id: 41,
    modified: true,
    text: 'source unsaved',
    uri: 'memfs:///project/auth.ts',
  })
  expect(invoke).not.toHaveBeenCalledWith('Editor.getComponentState', 42)
})

test('returns no document for an absent or unbound application', async () => {
  const invoke = createInvoke()
  await expect(getOpenTextDocumentWithInvoke(invoke, 'memfs:///project/auth.ts', undefined)).resolves.toBeUndefined()
  await expect(getOpenTextDocumentWithInvoke(invoke, 'memfs:///project/auth.ts', 'missing')).resolves.toBeUndefined()
  expect(invoke).not.toHaveBeenCalled()
})

test('a rejected conditional edit cannot save or render another version', async () => {
  const base = createInvoke()
  const invoke = jest.fn(async (method: string, ...args: readonly unknown[]) => {
    if (method === 'Editor.compareAndSetText') {
      throw new Error('File changed since it was read')
    }
    return base(method, args[0] as number)
  })
  const execute = jest.fn(async () => {})
  await expect(
    applyOpenTextDocumentEditWithInvoke(invoke, execute, 'memfs:///project/auth.ts', 'older text', 'updated', 'chat-source'),
  ).rejects.toThrow('File changed')
  expect(invoke).not.toHaveBeenCalledWith('Editor.save', 41, true)
  expect(execute).not.toHaveBeenCalled()
})

test('saves a successful conditional edit and confirms the original document', async () => {
  const base = createInvoke()
  let saved = false
  const invoke = jest.fn(async (method: string, ...args: readonly unknown[]) => {
    if (method === 'Editor.save') {
      saved = true
      return undefined
    }
    if (method === 'Editor.getComponentState' && saved) {
      return { applicationId: 'chat-source', modified: false, uri: 'memfs:///project/auth.ts' }
    }
    return base(method, args[0] as number)
  })
  const execute = jest.fn(async () => {})
  await expect(
    applyOpenTextDocumentEditWithInvoke(invoke, execute, 'memfs:///project/auth.ts', 'source unsaved', 'updated', 'chat-source'),
  ).resolves.toBe(true)
  expect(invoke).toHaveBeenCalledWith('Editor.compareAndSetText', 41, 'memfs:///project/auth.ts', 'source unsaved', 'updated', 'chat-source')
  expect(invoke).toHaveBeenCalledWith('Editor.save', 41, true)
  expect(execute).toHaveBeenCalledWith('Viewlet.executeViewletCommand', 41, 'renderPending')
})
