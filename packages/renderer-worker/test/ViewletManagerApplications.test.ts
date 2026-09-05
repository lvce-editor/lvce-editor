import { afterEach, beforeEach, expect, jest, test } from '@jest/globals'
import * as ApplicationRegistry from '../src/parts/ApplicationRegistry/ApplicationRegistry.ts'
import * as ViewletStates from '../src/parts/ViewletStates/ViewletStates.js'

jest.unstable_mockModule('../src/parts/RendererProcess/RendererProcess.js', () => ({ invoke: jest.fn(async () => {}) }))

const ViewletManager = await import('../src/parts/ViewletManager/ViewletManager.js')
const RendererProcess = await import('../src/parts/RendererProcess/RendererProcess.js')
const Command = await import('../src/parts/Command/Command.js')

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

test('an ordinary editor command cannot overwrite the newly focused editor after await', async () => {
  const pending = Promise.withResolvers<void>()
  const module = {
    create: (uid: number) => ({ uid, value: 'initial' }),
    loadContent: async (state) => state,
    hasFunctionalRender: true,
    render: [],
    Commands: {
      async update(state) {
        await pending.promise
        return { ...state, value: 'finished' }
      },
      selectAll: (state) => ({ ...state, value: 'selected' }),
    },
  }
  for (const uid of [11, 12]) {
    await ViewletManager.load({ uid, id: 'TestFocusedEditor', type: 0, show: false, getModule: async () => module })
  }
  const closingUpdate = Command.execute('TestFocusedEditor.update')
  ViewletStates.setFocusedInstanceByType(11, 'TestFocusedEditor')
  pending.resolve()
  await closingUpdate
  await Command.execute('TestFocusedEditor.selectAll')

  expect(ViewletStates.getState(11)).toMatchObject({ uid: 11, value: 'selected' })
  expect(ViewletStates.getState(12)).toMatchObject({ uid: 12, value: 'finished' })
})

test('concurrent loads cannot claim the same uid even inside one application', async () => {
  ApplicationRegistry.create({ id: 'source', layoutUid: 1, workspacePath: '', workspaceUri: '', href: '' })
  const gate = Promise.withResolvers<void>()
  const entered = Promise.withResolvers<void>()
  const dispose = jest.fn(async () => {})
  const module = {
    create: (uid: number) => ({ uid }),
    loadContent: async (state) => {
      entered.resolve()
      await gate.promise
      return state
    },
    dispose,
    hasFunctionalRender: true,
    render: [],
  }
  const viewlet = { applicationId: 'source', uid: 3, id: 'TestApplicationView', type: 0, show: false, getModule: async () => module }
  const first = ViewletManager.load({ ...viewlet })
  const result = Promise.allSettled([first])
  await entered.promise
  await expect(ViewletManager.load({ ...viewlet })).rejects.toThrow('already in use')
  ApplicationRegistry.close('source')
  gate.resolve()
  await ApplicationRegistry.waitForOperations('source')
  expect(await result).toEqual([{ status: 'rejected', reason: expect.objectContaining({ message: 'Application is closing: source' }) }])
  expect(dispose).toHaveBeenCalledTimes(1)
  expect(ViewletStates.getByUid(3)).toBeUndefined()
  expect(ApplicationRegistry.getOwner(3)).toBeUndefined()
})
