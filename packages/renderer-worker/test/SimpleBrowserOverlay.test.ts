import { beforeEach, expect, jest, test } from '@jest/globals'
import * as ViewletStates from '../src/parts/ViewletStates/ViewletStates.js'

beforeEach(() => {
  jest.resetAllMocks()
  ViewletStates.reset()
})

jest.unstable_mockModule('../src/parts/Viewlet/Viewlet.js', () => ({
  executeViewletCommand: jest.fn(),
}))

const Viewlet = await import('../src/parts/Viewlet/Viewlet.js')
const SimpleBrowserOverlay = await import('../src/parts/SimpleBrowserOverlay/SimpleBrowserOverlay.js')

const addMain = (activeEditorUid) => {
  ViewletStates.set(1, {
    state: {
      groups: [
        {
          activeIndex: 0,
          editors: [{ uid: activeEditorUid }],
        },
      ],
      uid: 1,
    },
    renderedState: { uid: 1 },
    moduleId: 'Main',
    factory: {},
  })
}

const addSimpleBrowser = (uid = 2, visible = true) => {
  ViewletStates.set(uid, {
    state: { uid },
    renderedState: { uid },
    moduleId: 'SimpleBrowser',
    factory: { isVisible: () => visible },
  })
}

test('does not show an overlay when Simple Browser is not open', async () => {
  addMain(3)

  await SimpleBrowserOverlay.show('menu')

  expect(Viewlet.executeViewletCommand).not.toHaveBeenCalled()
})

test('does not hide an overlay when Simple Browser is not visible', async () => {
  addMain(3)
  addSimpleBrowser(2, false)

  await SimpleBrowserOverlay.hide('menu')

  expect(Viewlet.executeViewletCommand).not.toHaveBeenCalled()
})

test('shows and hides overlays when Simple Browser is visible', async () => {
  addMain(2)
  addSimpleBrowser()

  await SimpleBrowserOverlay.show('menu')
  await SimpleBrowserOverlay.hide('menu')

  expect(Viewlet.executeViewletCommand).toHaveBeenNthCalledWith(1, 2, 'showOverlay', 'menu')
  expect(Viewlet.executeViewletCommand).toHaveBeenNthCalledWith(2, 2, 'hideOverlay', 'menu')
})

test('shows and hides overlays for a preview or full-width browser outside Main', async () => {
  addMain(3)
  addSimpleBrowser()

  await SimpleBrowserOverlay.show('menu')
  await SimpleBrowserOverlay.hide('menu')

  expect(Viewlet.executeViewletCommand).toHaveBeenNthCalledWith(1, 2, 'showOverlay', 'menu')
  expect(Viewlet.executeViewletCommand).toHaveBeenNthCalledWith(2, 2, 'hideOverlay', 'menu')
})

test('targets each visible browser by uid even when a hidden browser has focus', async () => {
  addSimpleBrowser(2, false)
  addSimpleBrowser(3)
  addSimpleBrowser(4)
  ViewletStates.setFocusedInstanceByType(2, 'SimpleBrowser')

  await SimpleBrowserOverlay.show('menu')
  await SimpleBrowserOverlay.hide('menu')

  expect(Viewlet.executeViewletCommand.mock.calls).toEqual([
    [3, 'showOverlay', 'menu'],
    [4, 'showOverlay', 'menu'],
    [3, 'hideOverlay', 'menu'],
    [4, 'hideOverlay', 'menu'],
  ])
})
