import { expect, test } from '@jest/globals'
import * as ViewletExtensions from '../src/parts/ViewletExtensions/ViewletExtensions.ipc.js'
import * as ViewletManager from '../src/parts/ViewletManager/ViewletManager.js'
import * as ViewletModuleId from '../src/parts/ViewletModuleId/ViewletModuleId.js'

const render = (oldState, newState) => {
  return ViewletManager.render(ViewletExtensions, oldState, newState, ViewletModuleId.Extensions)
}

test.skip('render - same state', () => {
  const oldState = {
    ...ViewletExtensions.create(),
    items: [
      {
        name: 'test extension 1',
        authorId: 'test publisher 1',
        version: '0.0.1',
        id: 'test-publisher.test-extension-1',
      },
      {
        name: 'test extension 2',
        authorId: 'test publisher 2',
        version: '0.0.1',
        id: 'test-publisher.test-extension-2',
      },
      {
        name: 'test extension 3',
        authorId: 'test publisher 3',
        version: '0.0.1',
        id: 'test-publisher.test-extension-3',
      },
    ],
    height: 124,
    deltaY: 62,
  }
  const newState = oldState
  expect(render(oldState, newState)).toEqual([])
})

test.skip('render - filtered extensions are different', () => {
  const oldState = {
    ...ViewletExtensions.create(),
    items: [
      {
        name: 'test extension 1',
        authorId: 'test publisher 1',
        version: '0.0.1',
        id: 'test-publisher.test-extension-1',
      },
    ],
    height: 124,
    deltaY: 62,
    maxLineY: 1,
  }
  const newState = {
    ...oldState,
    items: [
      {
        name: 'test extension 2',
        authorId: 'test publisher 2',
        version: '0.0.1',
        id: 'test-publisher.test-extension-2',
      },
    ],
  }
  expect(render(oldState, newState)).toEqual([])
})

test.skip('render - negative margin is different', () => {
  const oldState = {
    ...ViewletExtensions.create(),
    items: [
      {
        name: 'test extension 1',
        authorId: 'test publisher 1',
        version: '0.0.1',
        id: 'test-publisher.test-extension-1',
      },
    ],
    height: 124,
    deltaY: 62,
    finalDeltaY: 0,
  }
  const newState = {
    ...oldState,
    deltaY: 10,
  }
  expect(render(oldState, newState)).toEqual([['Viewlet.send', 'Extensions', 'setExtensionsDom', expect.any(Array)]])
})

test.skip('render - focused index is different', () => {
  const oldState = {
    ...ViewletExtensions.create(),
    items: [
      {
        name: 'test extension 1',
        authorId: 'test publisher 1',
        version: '0.0.1',
        id: 'test-publisher.test-extension-1',
      },
      {
        name: 'test extension 2',
        authorId: 'test publisher 2',
        version: '0.0.1',
        id: 'test-publisher.test-extension-2',
      },
      {
        name: 'test extension 3',
        authorId: 'test publisher 3',
        version: '0.0.1',
        id: 'test-publisher.test-extension-3',
      },
    ],
    height: 124,
    deltaY: 62,
    focusedIndex: 0,
  }
  const newState = {
    ...oldState,
    focusedIndex: 1,
  }
  expect(render(oldState, newState)).toEqual([['Viewlet.send', 'Extensions', 'setExtensionsDom', expect.any(Array)]])
})
