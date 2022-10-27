import * as ViewletExtensions from '../src/parts/ViewletExtensions/ViewletExtensions.js'
import * as ViewletExtensionsHandleWheel from '../src/parts/ViewletExtensions/ViewletExtensionsHandleWheel.js'

test('handleWheel - scroll down', () => {
  const state = {
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
    deltaY: 0,
    itemHeight: 62,
    finalDeltaY: 3 * 62 - 124,
  }
  expect(ViewletExtensionsHandleWheel.handleWheel(state, 62)).toMatchObject({
    minLineY: 1,
    deltaY: 62,
  })
})

test('handleWheel - scroll up', () => {
  const state = {
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
    itemHeight: 62,
  }
  expect(ViewletExtensionsHandleWheel.handleWheel(state, -62)).toMatchObject({
    deltaY: 0,
    minLineY: 0,
  })
})
