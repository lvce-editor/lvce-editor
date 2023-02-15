import * as GetSplitDimensionsUp from '../src/parts/GetSplitDimensionsUp/GetSplitDimensionsUp.js'

test('getSplitDimensionsUp', () => {
  const x = 0
  const y = 0
  const width = 100
  const height = 100
  const halfWidth = width / 2
  const halfHeight = height / 2
  const sashSize = 4
  const sashVisibleSize = 1
  const tabHeight = 35
  expect(GetSplitDimensionsUp.getSplitDimensionsUp(x, y, width, height, halfWidth, halfHeight, sashSize, sashVisibleSize, tabHeight)).toEqual({
    originalHeight: 15,
    originalTabsHeight: 35,
    originalTabsWidth: 100,
    originalTabsX: 0,
    originalTabsY: 50,
    originalWidth: 100,
    originalX: 0,
    originalY: 50,
    overlayHeight: 15,
    overlayTabsHeight: 35,
    overlayTabsWidth: 100,
    overlayTabsX: 0,
    overlayTabsY: 0,
    overlayWidth: 100,
    overlayX: 0,
    overlayY: 35,
    sashHeight: 4,
    sashWidth: 100,
    sashX: 0,
    sashY: 50,
  })
})
