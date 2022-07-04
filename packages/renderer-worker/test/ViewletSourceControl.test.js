import * as ViewletSourceControl from '../src/parts/Viewlet/ViewletSourceControl.js'
import * as RendererProcess from '../src/parts/RendererProcess/RendererProcess.js'
import * as ExtensionHost from '../src/parts/ExtensionHost/ExtensionHostCore.js'
import * as SharedProcess from '../src/parts/SharedProcess/SharedProcess.js'
import { jest } from '@jest/globals'

beforeAll(() => {
  ExtensionHost.state.status = ExtensionHost.STATUS_RUNNING
})

test('name', () => {
  expect(ViewletSourceControl.name).toBe('Source Control')
})

test('create', () => {
  const state = ViewletSourceControl.create()
  expect(state).toBeDefined()
})

test.skip('loadContent', async () => {
  const state = ViewletSourceControl.create()
  expect(await ViewletSourceControl.loadContent(state)).toEqual({
    disposed: false,
    src: 'abc',
  })
})

test.skip('contentLoaded', async () => {
  const state = { ...ViewletSourceControl.create() }
  await ViewletSourceControl.contentLoaded(state)
  expect(RendererProcess.state.send).toHaveBeenCalledTimes(1)
  expect(RendererProcess.state.send).toHaveBeenCalledWith({})
})

test('dispose', () => {
  const state = ViewletSourceControl.create()
  expect(ViewletSourceControl.dispose(state)).toMatchObject({
    disposed: true,
  })
})

test('resize', () => {
  const state = ViewletSourceControl.create()
  const { newState, commands } = ViewletSourceControl.resize(state, {
    top: 200,
    left: 200,
    width: 200,
    height: 200,
  })
  // TODO
  expect(newState).toMatchObject({
    disposed: false,
    height: 200,
    index: [],
    left: 200,
    merge: [],
    top: 200,
    untracked: [],
    width: 200,
    workingTree: [],
  })
})

test('acceptInput', async () => {
  SharedProcess.state.send = jest.fn((message) => {
    switch (message.method) {
      case 'ExtensionHost.sourceControlAcceptInput':
        SharedProcess.state.receive({
          id: message.id,
          jsonrpc: '2.0',
          result: null,
        })
        break
      case 'ExtensionManagement.getExtensions':
        SharedProcess.state.receive({
          id: message.id,
          jsonrpc: '2.0',
          result: [],
        })
        break
      default:
        throw new Error('unexpected message')
    }
  })
  const state = ViewletSourceControl.create()
  expect(await ViewletSourceControl.acceptInput(state, 'abc')).toMatchObject({
    inputValue: '',
  })
})

test('render - inputValue changed', () => {
  const oldState = ViewletSourceControl.create()
  const newState = {
    ...oldState,
    inputValue: 'abc',
  }
  expect(ViewletSourceControl.render(oldState, newState)).toEqual([
    ['Viewlet.send', 'Source Control', 'setInputValue', 'abc'],
  ])
})
