import * as GetSplitDimensionsLeft from '../src/parts/GetSplitDimensionsLeft/GetSplitDimensionsLeft.js'
import * as SashOrientation from '../src/parts/SashOrientation/SashOrientation.js'

test('getSplitDimensionsLeft', () => {
  const x = 0
  const y = 0
  const width = 100
  const height = 100
  const halfWidth = width / 2
  const halfHeight = height / 2
  const sashSize = 4
  const sashVisibleSize = 1
  const tabHeight = 35
  expect(GetSplitDimensionsLeft.getSplitDimensionsLeft(x, y, width, height, halfWidth, halfHeight, sashSize, sashVisibleSize, tabHeight)).toEqual({
    originalTabsHeight: 35,
    originalTabsWidth: 50,
    originalTabsX: 50,
    originalTabsY: 0,
    originalWidth: 50,
    originalX: 50,
    originalY: 35,
    orignalHeight: 65,
    overlayHeight: 65,
    overlayTabsHeight: 35,
    overlayTabsWidth: 50,
    overlayTabsX: 0,
    overlayTabsY: 0,
    overlayWidth: 49,
    overlayX: 0,
    overlayY: 35,
    sashHeight: 100,
    sashWidth: 4,
    sashX: 50,
    sashY: 0,
    sashOrientation: SashOrientation.Vertical,
  })
})
