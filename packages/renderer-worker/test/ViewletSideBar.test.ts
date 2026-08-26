// @ts-nocheck
import { beforeEach, expect, jest, test } from '@jest/globals'

jest.unstable_mockModule('../src/parts/Command/Command.js', () => {
  return {
    execute: jest.fn(() => undefined),
  }
})

jest.unstable_mockModule('../src/parts/RendererProcess/RendererProcess.js', () => {
  return {
    invoke: jest.fn(() => undefined),
    state: {},
  }
})

jest.unstable_mockModule('../src/parts/GetExtensionViews/GetExtensionViews.ts', () => {
  return {
    getExtensionView: jest.fn(),
  }
})

jest.unstable_mockModule('../src/parts/SaveState/SaveState.js', () => {
  return {
    saveViewletState: jest.fn(() => undefined),
    saveViewletStateWithStorageId: jest.fn(() => undefined),
  }
})

jest.unstable_mockModule('../src/parts/ViewletManager/ViewletManager.js', () => {
  return {
    load: jest.fn(() => []),
    runLoadContentLater: jest.fn(),
  }
})

const Command = await import('../src/parts/Command/Command.js')
const GetExtensionViews = await import('../src/parts/GetExtensionViews/GetExtensionViews.ts')
const RendererProcess = await import('../src/parts/RendererProcess/RendererProcess.js')
const SaveState = await import('../src/parts/SaveState/SaveState.js')
const ViewletManager = await import('../src/parts/ViewletManager/ViewletManager.js')
const ViewletSideBar = await import('../src/parts/ViewletSideBar/ViewletSideBar.js')
const ViewletStates = await import('../src/parts/ViewletStates/ViewletStates.js')
const SharedProcess = await import('../src/parts/SharedProcess/SharedProcess.js')
const JsonRpcVersion = await import('../src/parts/JsonRpcVersion/JsonRpcVersion.js')

beforeEach(() => {
  jest.resetAllMocks()
  ViewletStates.reset()
  Command.execute.mockResolvedValue('Search')
  RendererProcess.invoke.mockResolvedValue(undefined)
  SaveState.saveViewletState.mockResolvedValue(undefined)
  SaveState.saveViewletStateWithStorageId.mockResolvedValue(undefined)
  ViewletManager.load.mockResolvedValue([['Viewlet.createFunctionalRoot', 'Explorer', 2, true]])
  ViewletManager.runLoadContentLater.mockReturnValue(undefined)
  GetExtensionViews.getExtensionView.mockResolvedValue(undefined)
})

test.skip('openViewlet', async () => {
  RendererProcess.state.send = jest.fn()
  await ViewletSideBar.openViewlet('Noop')
  expect(RendererProcess.state.send).toHaveBeenCalledTimes(1)
  expect(RendererProcess.state.send).toHaveBeenCalledWith(['Viewlet.appendViewlet', 'SideBar', 'Noop', false])
})

// TODO sideBar is hard to test because of dependencies to Viewlet, Lifecycle and others, would need to mock Viewlet, Lifecycle etc. which would not be good

test.skip('showOrHideViewlet - show explorer, then search, then explorer again', async () => {
  RendererProcess.state.send = jest.fn((message) => {
    switch (message[0]) {
      case 909090:
        const callbackId = message[1]
        RendererProcess.state.handleMessage([/* Callback.resolve */ 67330, /* callbackId */ callbackId, /* result */ undefined])
        break
      default:
        throw new Error('unexpected message')
    }
  })
  SharedProcess.state.send = jest.fn((message) => {
    switch (message.method) {
      case 112:
        SharedProcess.state.receive({
          id: message.id,
          jsonrpc: JsonRpcVersion.Two,
          result: '/',
        })
        break
      default:
        throw new Error('unexpected message')
    }
  })
  const state = ViewletSideBar.create(1)
  await ViewletSideBar.showOrHideViewlet(state, 'Explorer')
  await ViewletSideBar.showOrHideViewlet(state, 'Search')
  await ViewletSideBar.showOrHideViewlet(state, 'Explorer')
  expect(state.currentViewletId).toBe('Explorer')
  expect(Layout.isSideBarVisible()).toBe(true)
})

test.skip('resize', () => {
  const state = ViewletSideBar.create(1)
  const { newState } = ViewletSideBar.resize(state, {
    x: 200,
    y: 200,
    width: 200,
    height: 200,
  })
  expect(newState).toEqual({
    currentViewletId: '',
    height: 200,
    x: 200,
    y: 200,
    width: 200,
    titleAreaHeight: 35,
  })
})

test.skip('loadContent - get viewlet id from savedState', async () => {
  const state = ViewletSideBar.create(1)
  const newState = await ViewletSideBar.loadContent(state, {
    currentViewletId: 'Test',
  })
  expect(newState).toMatchObject({
    currentViewletId: 'Test',
  })
})

test('loadContent opens explorer when restore is disabled', async () => {
  const state = ViewletSideBar.create(1, '', 0, 0, 300, 500)

  const newState = await ViewletSideBar.loadContent(state, { restore: false }, 'Search')

  expect(Command.execute).not.toHaveBeenCalled()
  expect(ViewletManager.load).toHaveBeenCalledWith(
    expect.objectContaining({
      id: 'Explorer',
      uri: 'Explorer',
    }),
    false,
    false,
    { restore: false },
  )
  expect(SaveState.saveViewletState).not.toHaveBeenCalled()
  expect(newState).toMatchObject({
    currentViewletId: 'Explorer',
  })
})

test('handleSideBarViewletChange uses child title', async () => {
  const state = ViewletSideBar.create(1, '', 0, 0, 300, 500)
  ViewletManager.load.mockResolvedValue([
    ['Viewlet.createFunctionalRoot', 'Explorer', 2, true],
    ['Viewlet.send', 1, 'setTitle', 'workspace-name'],
  ])

  const newState = await ViewletSideBar.handleSideBarViewletChange(state, 'Explorer')

  expect(RendererProcess.invoke).toHaveBeenCalledWith('Viewlet.sendMultiple', [['Viewlet.createFunctionalRoot', 'Explorer', 2, true]])
  expect(ViewletManager.runLoadContentLater).toHaveBeenCalledWith(expect.any(Number))
  expect(newState).toMatchObject({
    currentViewletId: 'Explorer',
    title: 'workspace-name',
  })
})

test('handleSideBarViewletChange saves the concrete sidebar child under the viewlet storage id', async () => {
  const state = {
    ...ViewletSideBar.create(1, '', 0, 0, 300, 500),
    childUid: 99,
    currentViewletId: 'Search',
  }

  await ViewletSideBar.handleSideBarViewletChange(state, 'Explorer')

  expect(SaveState.saveViewletStateWithStorageId).toHaveBeenCalledWith(99, 'Search')
  expect(SaveState.saveViewletState).not.toHaveBeenCalled()
})

test('handleSideBarViewletChange disposes the previously visible child', async () => {
  const childState = { uid: 99 }
  ViewletStates.set(99, {
    factory: {},
    moduleId: 'Search',
    renderedState: childState,
    state: childState,
  })
  const state = {
    ...ViewletSideBar.create(1, '', 0, 0, 300, 500),
    childUid: 99,
    currentViewletId: 'Search',
  }

  await ViewletSideBar.handleSideBarViewletChange(state, 'Explorer')

  expect(RendererProcess.invoke).toHaveBeenCalledWith('Viewlet.sendMultiple', [
    ['Viewlet.dispose', 99],
    ['Viewlet.createFunctionalRoot', 'Explorer', 2, true],
  ])
  expect(ViewletStates.getInstance(99)).toBeUndefined()
})

test('getOwnedViewletIds returns the visible sidebar child', () => {
  expect(ViewletSideBar.getOwnedViewletIds({ childUid: 99 })).toEqual([99])
  expect(ViewletSideBar.getOwnedViewletIds({ childUid: -1 })).toEqual([])
})

test('handleSideBarViewletChange gives an opted-out extension view the full sidebar', async () => {
  const state = ViewletSideBar.create(1, '', 0, 0, 300, 500)
  GetExtensionViews.getExtensionView.mockResolvedValue({
    extensionId: 'builtin.chat-view-2',
    id: 'chat2.views.chat',
    showSideBarHeader: false,
  })
  ViewletManager.load.mockResolvedValue([
    ['Viewlet.createFunctionalRoot', 'ExtensionView', 2, true],
    ['Viewlet.send', 1, 'setActionsDom', ['chat-actions']],
  ])

  const newState = await ViewletSideBar.handleSideBarViewletChange(state, 'chat2.views.chat')

  expect(ViewletManager.load).toHaveBeenCalledWith(
    expect.objectContaining({
      height: 500,
      id: 'ExtensionView',
      uri: 'chat2.views.chat',
      y: 0,
    }),
    false,
    true,
    undefined,
  )
  expect(RendererProcess.invoke).toHaveBeenCalledWith('Viewlet.sendMultiple', [['Viewlet.createFunctionalRoot', 'ExtensionView', 2, true]])
  expect(newState).toMatchObject({
    actionsUid: -1,
    currentExtensionId: 'builtin.chat-view-2',
    titleAreaHeight: 0,
  })
})

test('handleSideBarViewletChange clears the extension id when opening a built-in view', async () => {
  const state = {
    ...ViewletSideBar.create(1, '', 0, 0, 300, 500),
    currentExtensionId: 'sample.extension',
  }

  const newState = await ViewletSideBar.handleSideBarViewletChange(state, 'Explorer')

  expect(newState.currentExtensionId).toBe('')
})

test('handleSideBarViewletChange omits empty listener registration for its new actions root', async () => {
  const state = ViewletSideBar.create(1, '', 0, 0, 300, 500)
  ViewletManager.load.mockResolvedValue([
    ['Viewlet.createFunctionalRoot', 'Explorer', 2, true],
    ['Viewlet.send', 1, 'setActionsDom', ['explorer-actions']],
  ])

  const newState = await ViewletSideBar.handleSideBarViewletChange(state, 'Explorer')

  expect(RendererProcess.invoke).toHaveBeenCalledWith('Viewlet.sendMultiple', [
    ['Viewlet.createFunctionalRoot', 'Explorer', 2, true],
    ['Viewlet.createFunctionalRoot', 'Explorer', newState.actionsUid, true],
    ['Viewlet.setDom2', newState.actionsUid, ['explorer-actions']],
    ['Viewlet.setUid', newState.actionsUid, newState.childUid],
  ])
  expect(RendererProcess.invoke.mock.calls[0][1]).not.toContainEqual(['Viewlet.registerEventListeners', expect.any(Number), []])
  expect(newState.actionsUid).not.toBe(-1)
})

test('setTitle', () => {
  const state = ViewletSideBar.create(1, '', 0, 0, 300, 500)

  expect(ViewletSideBar.setTitle(state, 'workspace-name')).toEqual({
    ...state,
    title: 'workspace-name',
  })
})

test('setActionsDom updates an existing actions root', () => {
  const state = {
    ...ViewletSideBar.create(1, '', 0, 0, 300, 500),
    actionsUid: 3,
    childUid: 2,
  }

  const result = ViewletSideBar.setActionsDom(state, ['updated-actions'], 2)

  expect(result).toEqual({
    commands: [['Viewlet.setDom2', 3, ['updated-actions']]],
    handled: true,
    renderParent: false,
    statePatch: {
      actionsEventListeners: [],
    },
  })
})

test('setActionsDom creates an actions root when actions become available', () => {
  const state = {
    ...ViewletSideBar.create(1, '', 0, 0, 300, 500),
    childUid: 2,
    currentViewletId: 'sample.views.main',
  }

  const result = ViewletSideBar.setActionsDom(state, ['new-actions'], 2, ['click'])

  expect(result.commands).toEqual([
    ['Viewlet.createFunctionalRoot', 'sample.views.main', result.statePatch.actionsUid, true],
    ['Viewlet.registerEventListeners', result.statePatch.actionsUid, ['click']],
    ['Viewlet.setDom2', result.statePatch.actionsUid, ['new-actions']],
    ['Viewlet.setUid', result.statePatch.actionsUid, 2],
  ])
  expect(result.statePatch.actionsUid).not.toBe(-1)
})

test('setActionsDom registers new listeners on an existing actions root', () => {
  const state = {
    ...ViewletSideBar.create(1, '', 0, 0, 300, 500),
    actionsUid: 3,
    childUid: 2,
  }

  const result = ViewletSideBar.setActionsDom(state, ['updated-actions'], 2, ['click'])

  expect(result).toEqual({
    commands: [
      ['Viewlet.registerEventListeners', 3, ['click']],
      ['Viewlet.setDom2', 3, ['updated-actions']],
    ],
    handled: true,
    renderParent: false,
    statePatch: {
      actionsEventListeners: ['click'],
    },
  })
})

test('setActionsDom ignores updates from a stale child', () => {
  const state = {
    ...ViewletSideBar.create(1, '', 0, 0, 300, 500),
    childUid: 2,
  }

  const result = ViewletSideBar.setActionsDom(state, ['stale-actions'], 3)

  expect(result).toEqual({
    commands: [],
    handled: false,
    renderParent: false,
    statePatch: {},
  })
})
