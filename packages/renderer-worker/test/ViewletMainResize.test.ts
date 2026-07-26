import { expect, jest, test } from '@jest/globals'

jest.unstable_mockModule('../src/parts/Viewlet/Viewlet.js', () => ({
  resize: jest.fn(() => []),
}))

const ViewletMainResize = await import('../src/parts/ViewletMain/ViewletMainResize.js')

test('resize stores the updated editor group bounds', async () => {
  const state = {
    x: 0,
    y: 20,
    width: 100,
    height: 160,
    tabHeight: 35,
    groups: [
      {
        activeIndex: -1,
        editors: [],
        height: 160,
        tabsUid: -1,
        width: 50,
        x: 0,
        y: 20,
      },
      {
        activeIndex: -1,
        editors: [],
        height: 160,
        tabsUid: -1,
        width: 50,
        x: 50,
        y: 20,
      },
    ],
  }

  const { newState } = await ViewletMainResize.resize(state, {
    x: 10,
    y: 5,
    width: 240,
    height: 160,
  })

  expect(newState.groups).toEqual([
    {
      activeIndex: -1,
      editors: [],
      height: 160,
      tabsUid: -1,
      width: 120,
      x: 0,
      y: 25,
    },
    {
      activeIndex: -1,
      editors: [],
      height: 160,
      tabsUid: -1,
      width: 120,
      x: 120,
      y: 25,
    },
  ])
})
