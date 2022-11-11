import { jest } from '@jest/globals'
import * as RendererProcess from '../src/parts/RendererProcess/RendererProcess.js'
import * as ViewletSideBar from '../src/parts/ViewletSideBar/ViewletSideBar.js'
import * as SharedProcess from '../src/parts/SharedProcess/SharedProcess.js'
import * as JsonRpcVersion from '../src/parts/JsonRpcVersion/JsonRpcVersion.js'

test.skip('openViewlet', async () => {
  RendererProcess.state.send = jest.fn()
  await ViewletSideBar.openViewlet('Noop')
  expect(RendererProcess.state.send).toHaveBeenCalledTimes(1)
  expect(RendererProcess.state.send).toHaveBeenCalledWith([
    'Viewlet.appendViewlet',
    'SideBar',
    'Noop',
    false,
  ])
})

// TODO sideBar is hard to test because of dependencies to Viewlet, Lifecycle and others, would need to mock Viewlet, Lifecycle etc. which would not be good

test.skip('showOrHideViewlet - show explorer, then search, then explorer again', async () => {
  RendererProcess.state.send = jest.fn((message) => {
    switch (message[0]) {
      case 909090:
        const callbackId = message[1]
        RendererProcess.state.handleMessage([
          /* Callback.resolve */ 67330,
          /* callbackId */ callbackId,
          /* result */ undefined,
        ])
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
  const state = ViewletSideBar.create()
  await ViewletSideBar.showOrHideViewlet(state, 'Explorer')
  await ViewletSideBar.showOrHideViewlet(state, 'Search')
  await ViewletSideBar.showOrHideViewlet(state, 'Explorer')
  expect(state.currentViewletId).toBe('Explorer')
  expect(Layout.isSideBarVisible()).toBe(true)
})

test('resize', () => {
  const state = ViewletSideBar.create()
  const { newState } = ViewletSideBar.resize(state, {
    top: 200,
    left: 200,
    width: 200,
    height: 200,
  })
  expect(newState).toEqual({
    currentViewletId: '',
    height: 200,
    left: 200,
    top: 200,
    width: 200,
    titleAreaHeight: 35,
  })
})

test('loadContent - get viewlet id from savedState', async () => {
  const state = ViewletSideBar.create()
  const newState = await ViewletSideBar.loadContent(state, {
    currentViewletId: 'Test',
  })
  expect(newState).toMatchObject({
    currentViewletId: 'Test',
  })
})
