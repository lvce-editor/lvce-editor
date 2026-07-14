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

const addSimpleBrowser = () => {
  ViewletStates.set(2, {
    state: { uid: 2 },
    renderedState: { uid: 2 },
    moduleId: 'SimpleBrowser',
    factory: {},
  })
}

test('does not show an overlay when Simple Browser is not open', async () => {
  addMain(3)

  await SimpleBrowserOverlay.show('menu')

  expect(Command.execute).not.toHaveBeenCalled()
})

test('does not hide an overlay when Simple Browser is not visible', async () => {
  addMain(3)
  addSimpleBrowser()

  await SimpleBrowserOverlay.hide('menu')

  expect(Command.execute).not.toHaveBeenCalled()
})

test('shows and hides overlays when Simple Browser is visible', async () => {
  addMain(2)
  addSimpleBrowser()

  await SimpleBrowserOverlay.show('menu')
  await SimpleBrowserOverlay.hide('menu')

  expect(Command.execute).toHaveBeenNthCalledWith(1, 'SimpleBrowser.showOverlay', 'menu')
  expect(Command.execute).toHaveBeenNthCalledWith(2, 'SimpleBrowser.hideOverlay', 'menu')
})
