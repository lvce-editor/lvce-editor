import { afterEach, beforeEach, expect, jest, test } from '@jest/globals'
import * as ViewletModuleId from '../src/parts/ViewletModuleId/ViewletModuleId.js'
import * as ViewletStates from '../src/parts/ViewletStates/ViewletStates.js'
import * as ApplicationRegistry from '../src/parts/ApplicationRegistry/ApplicationRegistry.ts'
import { applyOpenTextDocumentEditWithInvoke, getOpenTextDocumentWithInvoke } from '../src/parts/GetActiveEditor/GetActiveEditor.js'

beforeEach(() => {
  ApplicationRegistry.create({ href: '/', id: 'chat-source', layoutUid: 501, workspacePath: '/project', workspaceUri: 'memfs:///project/' })
  ApplicationRegistry.create({ href: '/', id: 'chat-preview', layoutUid: 502, workspacePath: '/project', workspaceUri: 'memfs:///project/' })
  ApplicationRegistry.own('chat-source', 41)
  ApplicationRegistry.own('chat-preview', 42)
  for (const [id, applicationId] of [
    [41, 'chat-source'],
    [42, 'chat-preview'],
  ] as const) {
    ViewletStates.set(id, {
      factory: {},
      moduleId: ViewletModuleId.EditorText,
      renderedState: { uid: id },
      state: { applicationId, id, uid: id, uri: 'memfs:///project/auth.ts' },
    })
  }
})

afterEach(async () => {
  ViewletStates.reset()
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
  const execute = jest.fn(async (..._args: readonly unknown[]) => {})
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
  const execute = jest.fn(async (..._args: readonly unknown[]) => {})
  await expect(
    applyOpenTextDocumentEditWithInvoke(invoke, execute, 'memfs:///project/auth.ts', 'source unsaved', 'updated', 'chat-source'),
  ).resolves.toBe(true)
  expect(invoke).toHaveBeenCalledWith('Editor.compareAndSetText', 41, 'memfs:///project/auth.ts', 'source unsaved', 'updated', 'chat-source')
  expect(invoke).toHaveBeenCalledWith('Editor.save', 41, true)
  expect(execute).toHaveBeenCalledWith('Viewlet.executeViewletCommand', 41, 'renderPending')
})

test('reading a closed file does not transfer unrelated open document contents', async () => {
  const invoke = createInvoke()
  await expect(getOpenTextDocumentWithInvoke(invoke, 'memfs:///project/closed.ts', 'chat-source')).resolves.toBeUndefined()
  expect(invoke).not.toHaveBeenCalled()
})

test('reads a legacy window buffer without accessing application-owned editors', async () => {
  ViewletStates.set(43, {
    factory: {},
    moduleId: ViewletModuleId.EditorText,
    renderedState: { uid: 43 },
    state: { id: 43, uid: 43, uri: 'memfs:///project/auth.ts' },
  })
  const invoke = jest.fn(async (_method: string, _id: number) => ({
    applicationId: undefined,
    lines: ['legacy unsaved'],
    modified: true,
    uri: 'memfs:///project/auth.ts',
  }))
  await expect(getOpenTextDocumentWithInvoke(invoke, 'memfs:///project/auth.ts', undefined)).resolves.toEqual({
    id: 43,
    modified: true,
    text: 'legacy unsaved',
    uri: 'memfs:///project/auth.ts',
  })
  expect(invoke).toHaveBeenCalledTimes(1)
  expect(invoke).toHaveBeenCalledWith('Editor.getComponentState', 43)
})
