import { expect, test } from '@jest/globals'
import * as LayoutPoints from '../src/parts/ViewletLayout/LayoutPoints.ts'
import * as SideBarLocationType from '../src/parts/SideBarLocationType/SideBarLocationType.js'
import * as ViewletLayout from '../src/parts/ViewletLayout/ViewletLayout.ts'

const createState = (sideBarLocation: number, titleBarless: boolean) => {
  return LayoutPoints.getPoints({
    ...ViewletLayout.create(1),
    activityBarVisible: true,
    activityBarWidth: 48,
    panelHeight: 160,
    panelMinHeight: 150,
    panelMaxHeight: 600,
    panelVisible: true,
    sideBarLocation,
    sideBarMinWidth: 170,
    sideBarMaxWidth: 9999999,
    sideBarVisible: true,
    sideBarWidth: 240,
    secondarySideBarMinWidth: 220,
    secondarySideBarMaxWidth: 9999999,
    secondarySideBarVisible: true,
    secondarySideBarWidth: 260,
    statusBarHeight: 20,
    statusBarVisible: true,
    titleBarHeight: titleBarless ? 29 : 35,
    titleBarless,
    titleBarVisible: true,
    windowHeight: 800,
    windowWidth: 1200,
  })
}

for (const [locationName, location] of [
  ['left', SideBarLocationType.Left],
  ['right', SideBarLocationType.Right],
] as const) {
  test(`titlebarless layout reserves window controls above the primary sidebar and activity bar with the sidebar on the ${locationName}`, () => {
    const titleBarless = createState(location, true)
    const regular = createState(location, false)

    expect(titleBarless).toMatchObject({
      activityBarTop: 29,
      activityBarHeight: regular.activityBarHeight + 6,
      mainTop: 0,
      mainHeight: regular.mainHeight + 35,
      secondarySideBarTop: 0,
      secondarySideBarHeight: regular.secondarySideBarHeight + 35,
      sideBarTop: 29,
      sideBarHeight: regular.sideBarHeight + 6,
      titleBarVisible: true,
    })
  })
}

test('titlebarless layout stays opt-in', () => {
  const state = createState(SideBarLocationType.Right, false)

  expect(state).toMatchObject({
    activityBarTop: 35,
    mainTop: 35,
    secondarySideBarTop: 35,
    sideBarTop: 35,
    titleBarVisible: true,
  })
})

test('hidden primary sidebar reserves a full-width control strip', () => {
  const state = LayoutPoints.getPoints({ ...createState(SideBarLocationType.Right, true), sideBarVisible: false })
  expect(state).toMatchObject({ titleBarLeft: 0, titleBarWidth: 1200, mainTop: 29, activityBarTop: 29 })
})

test('fullscreen removes both the window controls and their clearance', () => {
  const state = LayoutPoints.getPoints({ ...createState(SideBarLocationType.Right, true), titleBarVisible: false, fullScreen: true })
  expect(state).toMatchObject({ mainTop: 0, sideBarTop: 0, activityBarTop: 0, secondarySideBarTop: 0 })
})

test('preview space is excluded from the compact window control strip', () => {
  const state = LayoutPoints.getPoints({ ...createState(SideBarLocationType.Right, true), previewVisible: true, previewWidth: 400 })
  expect(state.titleBarLeft + state.titleBarWidth).toBe(state.previewLeft)
  expect(state.previewTop).toBe(0)
})
