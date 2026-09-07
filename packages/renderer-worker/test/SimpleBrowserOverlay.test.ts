import { beforeEach, expect, jest, test } from '@jest/globals'
import * as ViewletStates from '../src/parts/ViewletStates/ViewletStates.js'

beforeEach(() => {
  jest.resetAllMocks()
  ViewletStates.reset()
})

jest.unstable_mockModule('../src/parts/Command/Command.js', () => ({
  execute: jest.fn(),
}))

const Command = await import('../src/parts/Command/Command.js')
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

  expect(Command.execute).not.toHaveBeenCalled()
})

test('does not hide an overlay when Simple Browser is not visible', async () => {
  addMain(3)
  addSimpleBrowser(2, false)

  await SimpleBrowserOverlay.hide('menu')

  expect(Command.execute).not.toHaveBeenCalled()
})

test('shows and hides overlays when Simple Browser is visible', async () => {
  addMain(2)
  addSimpleBrowser()

  await SimpleBrowserOverlay.show('menu')
  await SimpleBrowserOverlay.hide('menu')

  expect(Command.execute).toHaveBeenNthCalledWith(1, 'Viewlet.executeViewletCommand', 2, 'showOverlay', 'menu')
  expect(Command.execute).toHaveBeenNthCalledWith(2, 'Viewlet.executeViewletCommand', 2, 'hideOverlay', 'menu')
})

test('shows and hides overlays for a preview or full-width browser outside Main', async () => {
  addMain(3)
  addSimpleBrowser()

  await SimpleBrowserOverlay.show('menu')
  await SimpleBrowserOverlay.hide('menu')

  expect(Command.execute).toHaveBeenNthCalledWith(1, 'Viewlet.executeViewletCommand', 2, 'showOverlay', 'menu')
  expect(Command.execute).toHaveBeenNthCalledWith(2, 'Viewlet.executeViewletCommand', 2, 'hideOverlay', 'menu')
})

test('targets each visible browser by uid even when a hidden browser has focus', async () => {
  addSimpleBrowser(2, false)
  addSimpleBrowser(3)
  addSimpleBrowser(4)
  ViewletStates.setFocusedInstanceByType(2, 'SimpleBrowser')

  await SimpleBrowserOverlay.show('menu')
  await SimpleBrowserOverlay.hide('menu')

  expect(jest.mocked(Command.execute).mock.calls).toEqual([
    ['Viewlet.executeViewletCommand', 3, 'showOverlay', 'menu'],
    ['Viewlet.executeViewletCommand', 4, 'showOverlay', 'menu'],
    ['Viewlet.executeViewletCommand', 3, 'hideOverlay', 'menu'],
    ['Viewlet.executeViewletCommand', 4, 'hideOverlay', 'menu'],
  ])
})
