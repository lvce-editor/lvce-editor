import * as ViewletExtensions from '../src/parts/ViewletExtensions/ViewletExtensions.js'
import * as ViewletExtensionsResize from '../src/parts/ViewletExtensions/ViewletExtensionsResize.js'

test('resize', () => {
  const state = {
    ...ViewletExtensions.create(),
    itemHeight: 62,
  }
  const newState = ViewletExtensionsResize.resize(state, {
    x: 200,
    y: 200,
    width: 200,
    height: 200,
  })
  // TODO
  expect(newState).toMatchObject({
    disposed: false,
    items: [],
    focusedIndex: -1,
    height: 200,
    x: 200,
    minLineY: 0,
    maxLineY: 3,
    deltaY: 0,
    searchValue: '',
    suggestionState: 0,
    y: 200,
    width: 200,
  })
})
