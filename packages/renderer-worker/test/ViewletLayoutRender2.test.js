import { expect, test } from '@jest/globals'

const ViewletLayoutRender2 = await import('../src/parts/ViewletLayout/ViewletLayoutRender2.ts')

test('renderCss throws for invalid layout bounds', () => {
  const oldState = /** @type {any} */ ({})
  const newState = /** @type {any} */ ({
    uid: 1,
    activityBarWidth: undefined,
    panelHeight: Number.NaN,
    sideBarWidth: undefined,
    secondarySideBarWidth: Number.NaN,
    titleBarHeight: undefined,
    previewLeft: Number.NaN,
    previewWidth: Number.NaN,
    sideBarLeft: undefined,
    secondarySideBarLeft: Number.NaN,
  })

  expect(() => ViewletLayoutRender2.render[1].apply(oldState, newState)).toThrow(new Error('expected value to be of type number'))
})

test('renderCss serializes valid layout bounds', () => {
  const oldState = /** @type {any} */ ({})
  const newState = /** @type {any} */ ({
    uid: 1,
    activityBarWidth: 48,
    panelHeight: 200,
    sideBarWidth: 240.2,
    secondarySideBarWidth: 299.6,
    titleBarHeight: 35,
    previewLeft: 799.6,
    previewWidth: 400,
    sideBarLeft: 48.4,
    secondarySideBarLeft: 700.2,
  })

  const result = ViewletLayoutRender2.render[1].apply(oldState, newState)

  expect(result).toEqual([
    [
      'Viewlet.setCss',
      1,
      `:root {
  --ActivityBarWidth: 48px;
  --PanelHeight: 200px;
  --SideBarWidth: 240px;
  --SecondarySideBarWidth: 300px;
  --TitleBarHeight: 35px;
  --SashPreviewLeft: 800px;
  --PreviewWidth: 400px;
  --SashSideBarLeft: 48px;
  --SashSecondarySideBarLeft: 1000px;
}`,
    ],
  ])
})

test('renderEventListeners tracks preview sash pointer events', () => {
  const listeners = ViewletLayoutRender2.renderEventListeners()
  const previewListener = listeners.find((listener) => listener.name === 'HandleSashPreviewPointerDown')

  expect(previewListener).toEqual(
    expect.objectContaining({
      params: ['handleSashPreviewPointerDown'],
      trackPointerEvents: ['HandleSashSideBarPointerMove', 'HandleSashSideBarPointerUp'],
    }),
  )
})
