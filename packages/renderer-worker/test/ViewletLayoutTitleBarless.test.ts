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
    titleBarVisible: !titleBarless,
    windowHeight: 800,
    windowWidth: 1200,
  })
}

for (const [locationName, location] of [
  ['left', SideBarLocationType.Left],
  ['right', SideBarLocationType.Right],
] as const) {
  test(`titlebarless layout reserves native controls above the primary sidebar and activity bar with the sidebar on the ${locationName}`, () => {
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
      titleBarVisible: false,
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
