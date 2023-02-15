import * as GetSplitDimensionsRight from '../src/parts/GetSplitDimensionsRight/GetSplitDimensionsRight.js'

test('getSplitDimensionsRight', () => {
  const x = 0
  const y = 0
  const width = 100
  const height = 100
  const halfWidth = width / 2
  const halfHeight = height / 2
  const sashSize = 4
  const sashVisibleSize = 1
  const tabHeight = 35
  expect(GetSplitDimensionsRight.getSplitDimensionsRight(x, y, width, height, halfWidth, halfHeight, sashSize, sashVisibleSize, tabHeight)).toEqual({
    originalHeight: 65,
    originalTabsHeight: 35,
    originalTabsWidth: 50,
    originalTabsX: 0,
    originalTabsY: 0,
    originalWidth: 50,
    originalX: 0,
    originalY: 35,
    overlayHeight: 65,
    overlayTabsHeight: 35,
    overlayTabsWidth: 50,
    overlayTabsX: 50,
    overlayTabsY: 0,
    overlayWidth: 49,
    overlayX: 51,
    overlayY: 35,
    sashHeight: 100,
    sashWidth: 4,
    sashX: 50,
    sashY: 0,
  })
})
