import { afterEach, beforeEach, expect, jest, test } from '@jest/globals'
import * as ApplicationRegistry from '../src/parts/ApplicationRegistry/ApplicationRegistry.ts'
import * as ViewletStates from '../src/parts/ViewletStates/ViewletStates.js'

jest.unstable_mockModule('../src/parts/RendererProcess/RendererProcess.js', () => ({ invoke: jest.fn(async () => {}) }))

const ViewletManager = await import('../src/parts/ViewletManager/ViewletManager.js')
const RendererProcess = await import('../src/parts/RendererProcess/RendererProcess.js')

const addLayout = (applicationId: string, uid: number, commands: object): void => {
  ApplicationRegistry.create({ id: applicationId, layoutUid: uid, workspacePath: '', workspaceUri: '', href: '' })
  const state = { uid, applicationId, value: 'initial' }
  ViewletStates.set(uid, {
    state,
    renderedState: state,
    moduleId: 'Layout',
    factory: { hasFunctionalRender: true, render: [], Commands: commands },
  })
}

beforeEach(() => {
  ViewletStates.reset()
  jest.clearAllMocks()
})

afterEach(() => {
  ViewletStates.reset()
  ApplicationRegistry.remove('source')
  ApplicationRegistry.remove('preview')
})

test('concurrent commands retain their application across await and focus changes', async () => {
  const pending = Promise.withResolvers<void>()
  const commands = {
    async update(state, value) {
      if (state.applicationId === 'source') {
        await pending.promise
      }
      return { ...state, value }
    },
  }
  addLayout('source', 1, commands)
  addLayout('preview', 2, commands)

  const sourceUpdate = ViewletManager.executeForApplication('source', 'Layout.update', 'source change')
  ViewletStates.setFocusedInstanceByType(2, 'Layout')
  await ViewletManager.executeForApplication('preview', 'Layout.update', 'preview change')
  pending.resolve()
  await sourceUpdate

  expect(ViewletStates.getState(1).value).toBe('source change')
  expect(ViewletStates.getState(2).value).toBe('preview change')
})

test('a command finishing after its view is removed cannot render into another application', async () => {
  const pending = Promise.withResolvers<void>()
  addLayout('source', 1, {
    async update(state) {
      await pending.promise
      return { ...state, value: 'late change' }
    },
  })
  addLayout('preview', 2, {})
  const update = ViewletManager.executeForApplication('source', 'Layout.update')
  ViewletStates.remove(1)
  pending.resolve()
  await update

  expect(ViewletStates.getInstance(1)).toBeUndefined()
  expect(ViewletStates.getState(2).value).toBe('initial')
  expect(RendererProcess.invoke).not.toHaveBeenCalled()
})
