import * as GetSplitDimensionsDown from '../src/parts/GetSplitDimensionsDown/GetSplitDimensionsDown.js'

test('getSplitDimensionsDown', () => {
  const x = 0
  const y = 0
  const width = 100
  const height = 100
  const halfWidth = width / 2
  const halfHeight = height / 2
  const sashSize = 4
  const sashVisibleSize = 1
  const tabHeight = 35
  expect(GetSplitDimensionsDown.getSplitDimensionsDown(x, y, width, height, halfWidth, halfHeight, sashSize, sashVisibleSize, tabHeight)).toEqual({
    originalTabs: 0,
    originalTabsHeight: 35,
    originalTabsWidth: 100,
    originalTabsY: 0,
    originalWidth: 100,
    originalX: 0,
    originalY: 35,
    originalHeight: 15,
    overlayHeight: 50,
    overlayTabsHeight: 35,
    overlayTabsWidth: 100,
    overlayTabsX: 0,
    overlayTabsY: 50,
    overlayWidth: 100,
    overlayX: 0,
    overlayY: 50,
    sashHeight: 4,
    sashWidth: 100,
    sashX: 0,
    sashY: 50,
  })
})
