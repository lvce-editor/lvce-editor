import { expect, test } from '@jest/globals'

const ViewletLayoutRender2 = await import('../src/parts/ViewletLayout/ViewletLayoutRender2.ts')

test('renderCss falls back to valid pixel values for invalid layout bounds', () => {
  const oldState = /** @type {any} */ ({})
  const newState = /** @type {any} */ ({
    uid: 1,
    activityBarWidth: undefined,
    panelHeight: Number.NaN,
    sideBarWidth: undefined,
    secondarySideBarWidth: Number.NaN,
    titleBarHeight: undefined,
    previewWidth: Number.NaN,
    sideBarLeft: undefined,
    secondarySideBarLeft: Number.NaN,
  })

  const result = ViewletLayoutRender2.render[1].apply(oldState, newState)

  expect(result).toEqual([
    [
      'Viewlet.setCss',
      1,
      `:root {
  --ActivityBarWidth: 0px;
  --PanelHeight: 0px;
  --SideBarWidth: 0px;
  --SecondarySideBarWidth: 0px;
  --TitleBarHeight: 0px;
  --PreviewWidth: 0px;
  --SashSideBarLeft: 0px;
  --SashSecondarySideBarLeft: 0px;
}`,
    ],
  ])
})
