import { expect, test } from '@jest/globals'

const ViewletLayoutRender2 = await import('../src/parts/ViewletLayout/ViewletLayoutRender2.ts')

test('renderCss throws for invalid layout bounds', () => {
  const oldState = {} as any
  const newState = {
    uid: 1,
    activityBarWidth: undefined,
    panelHeight: Number.NaN,
    panelWidth: Number.NaN,
    sideBarWidth: undefined,
    secondarySideBarWidth: Number.NaN,
    titleBarHeight: undefined,
    previewLeft: Number.NaN,
    previewWidth: Number.NaN,
    sideBarLeft: undefined,
    secondarySideBarLeft: Number.NaN,
  } as any

  expect(() => ViewletLayoutRender2.render[1].apply(oldState, newState)).toThrow(new Error('expected value to be of type number'))
})

test('renderCss serializes valid layout bounds', () => {
  const oldState = {} as any
  const newState = {
    uid: 1,
    activityBarWidth: 48,
    panelHeight: 200,
    panelWidth: 800,
    sideBarWidth: 240.2,
    secondarySideBarWidth: 299.6,
    titleBarHeight: 35,
    panelTop: 200,
    previewLeft: 799.6,
    previewHeight: 765,
    previewWidth: 400,
    secondaryPreviewLeft: 1200,
    secondaryPreviewTop: 35,
    secondaryPreviewHeight: 765,
    secondaryPreviewWidth: 0,
    sideBarLeft: 48.4,
    secondarySideBarLeft: 700.2,
  } as any

  const result = ViewletLayoutRender2.render[1].apply(oldState, newState)

  expect(result).toEqual([
    [
      'Viewlet.setCss',
      1,
      `:root {
  --AppWidth: 100%;
  --AppHeight: 100%;
  --ActivityBarWidth: 48px;
  --PanelHeight: 200px;
  --PanelWidth: 800px;
  --SideBarWidth: 240px;
  --SecondarySideBarWidth: 300px;
  --TitleBarHeight: 35px;
  --SashPreviewLeft: 800px;
  --PreviewAreasWidth: 400px;
  --PreviewHeight: 765px;
  --PreviewWidth: 400px;
  --SashSecondaryPreviewLeft: 1200px;
  --SashSecondaryPreviewTop: 35px;
  --SecondaryPreviewHeight: 765px;
  --SecondaryPreviewWidth: 0px;
  --SashSideBarLeft: 48px;
  --SashSecondarySideBarLeft: 1000px;
  --SashPanelTop: 200px;
}`,
    ],
  ])
})

test('renderCss serializes explicit application bounds', () => {
  const oldState = {} as any
  const newState = {
    uid: 1,
    explicitBounds: true,
    windowWidth: 480,
    windowHeight: 320,
    activityBarWidth: 48,
    panelHeight: 200,
    panelWidth: 800,
    sideBarWidth: 240.2,
    secondarySideBarWidth: 299.6,
    titleBarHeight: 35,
    panelTop: 200,
    previewLeft: 799.6,
    previewHeight: 285,
    previewWidth: 400,
    secondaryPreviewLeft: 1200,
    secondaryPreviewTop: 35,
    secondaryPreviewHeight: 285,
    secondaryPreviewWidth: 0,
    sideBarLeft: 48.4,
    secondarySideBarLeft: 700.2,
  } as any

  const result = ViewletLayoutRender2.render[1].apply(oldState, newState)

  expect(result).toEqual([
    [
      'Viewlet.setCss',
      1,
      `:root {
  --AppWidth: 480px;
  --AppHeight: 320px;
  --ActivityBarWidth: 48px;
  --PanelHeight: 200px;
  --PanelWidth: 800px;
  --SideBarWidth: 240px;
  --SecondarySideBarWidth: 300px;
  --TitleBarHeight: 35px;
  --SashPreviewLeft: 800px;
  --PreviewAreasWidth: 400px;
  --PreviewHeight: 285px;
  --PreviewWidth: 400px;
  --SashSecondaryPreviewLeft: 1200px;
  --SashSecondaryPreviewTop: 35px;
  --SecondaryPreviewHeight: 285px;
  --SecondaryPreviewWidth: 0px;
  --SashSideBarLeft: 48px;
  --SashSecondarySideBarLeft: 1000px;
  --SashPanelTop: 200px;
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

test('renderEventListeners registers context menu handler', () => {
  const listeners = ViewletLayoutRender2.renderEventListeners()
  const contextMenuListener = listeners.find((listener) => listener.name === 'handleContextMenu')

  expect(contextMenuListener).toEqual(
    expect.objectContaining({
      params: ['handleContextMenu'],
    }),
  )
})

test('renderEventListeners registers side bar sash double click handler', () => {
  const listeners = ViewletLayoutRender2.renderEventListeners()
  const doubleClickListener = listeners.find((listener) => listener.name === 'handleSashDoubleClick')

  expect(doubleClickListener).toEqual({
    name: 'handleSashDoubleClick',
    params: ['handleSashDoubleClick', 'SideBar'],
  })
})

test('renderEventListeners registers preview close handler', () => {
  const listeners = ViewletLayoutRender2.renderEventListeners()
  const closeListener = listeners.find((listener) => listener.name === 'handleClickClose')

  expect(closeListener).toEqual({
    name: 'handleClickClose',
    params: ['hidePreview'],
  })
})

test('renderDom detects changed preview actions', () => {
  const oldState = {
    previewActionsUid: -1,
  } as any
  const newState = {
    previewActionsUid: 8,
  } as any

  expect(ViewletLayoutRender2.render[0].isEqual(oldState, newState)).toBe(false)
})
