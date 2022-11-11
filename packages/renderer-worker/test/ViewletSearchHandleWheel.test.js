import * as ViewletSearch from '../src/parts/ViewletSearch/ViewletSearch.js'
import * as ViewletSearchHandleWheel from '../src/parts/ViewletSearch/ViewletSearchHandleWheel.js'

test('handleWheel - scroll down', () => {
  const state = {
    ...ViewletSearch.create(),
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
    height: 40,
    deltaY: 0,
    itemHeight: 20,
    finalDeltaY: 3 * 20 - 40,
  }
  expect(ViewletSearchHandleWheel.handleWheel(state, 20)).toMatchObject({
    minLineY: 1,
    deltaY: 20,
  })
})

test.skip('handleWheel - scroll up', () => {
  const state = {
    ...ViewletSearch.create(),
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
  expect(ViewletSearchHandleWheel.handleWheel(state, -62)).toMatchObject({
    deltaY: 0,
    minLineY: 0,
  })
})
