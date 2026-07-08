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

jest.unstable_mockModule('../src/parts/SaveState/SaveState.js', () => {
  return {
    saveViewletState: jest.fn(() => undefined),
  }
})

jest.unstable_mockModule('../src/parts/ViewletManager/ViewletManager.js', () => {
  return {
    load: jest.fn(() => []),
  }
})

const Command = await import('../src/parts/Command/Command.js')
const RendererProcess = await import('../src/parts/RendererProcess/RendererProcess.js')
const SaveState = await import('../src/parts/SaveState/SaveState.js')
const ViewletManager = await import('../src/parts/ViewletManager/ViewletManager.js')
const ViewletSideBar = await import('../src/parts/ViewletSideBar/ViewletSideBar.js')
const SharedProcess = await import('../src/parts/SharedProcess/SharedProcess.js')
const JsonRpcVersion = await import('../src/parts/JsonRpcVersion/JsonRpcVersion.js')

beforeEach(() => {
  jest.resetAllMocks()
  Command.execute.mockResolvedValue('Search')
  RendererProcess.invoke.mockResolvedValue(undefined)
  SaveState.saveViewletState.mockResolvedValue(undefined)
  ViewletManager.load.mockResolvedValue([['Viewlet.createFunctionalRoot', 'Explorer', 2, true]])
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
  expect(newState).toMatchObject({
    currentViewletId: 'Explorer',
  })
})
