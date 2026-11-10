import { afterEach, beforeEach, expect, jest, test } from '@jest/globals'
import * as IsTest from '../src/parts/IsTest/IsTest.js'
import * as RendererFrameScheduler from '../src/parts/RendererFrameScheduler/RendererFrameScheduler.js'
import * as ViewletStates from '../src/parts/ViewletStates/ViewletStates.js'

const rpc = { invoke: jest.fn(async (..._args: readonly unknown[]) => {}) }

const LayoutIpc = await import('../src/parts/Layout/Layout.ipc.js')

beforeEach(() => {
  jest.clearAllMocks()
  ViewletStates.reset()
  IsTest.state.isTest = true
  RendererFrameScheduler.reset(rpc)
})

afterEach(() => {
  IsTest.state.isTest = false
  RendererFrameScheduler.reset(undefined)
  ViewletStates.reset()
})

for (const command of ['handleWorkspaceRefresh', 'refreshSourceControlBadgeCount']) {
  test(`legacy ${command} commits child render transactions and updates layout state`, async () => {
    const state = { revision: 0, uid: 13 }
    const commit = ['Viewlet.commitPending', 5, 42]
    const handler = jest.fn(async (state: Readonly<{ revision: number; uid: number }>, ..._args: readonly unknown[]) => {
      const { revision } = state
      return { commands: [commit], newState: { ...state, revision: revision + 1 } }
    })
    ViewletStates.set('Layout', {
      factory: { Commands: { [command]: handler }, name: 'Layout', render: () => [] },
      moduleId: 'Layout',
      renderedState: state,
      state,
    })
    const args = command === 'handleWorkspaceRefresh' ? [{ changed: ['memfs:///workspace/auto-save-on.txt'] }] : []

    await LayoutIpc.Commands[command](...args)

    expect(handler).toHaveBeenCalledWith(state, ...args)
    expect(rpc.invoke).toHaveBeenCalledWith('Viewlet.sendMultiple', [commit])
    expect(ViewletStates.getInstance('Layout').state.revision).toBe(1)
  })
}
