import { expect, jest, test } from '@jest/globals'

jest.unstable_mockModule('../src/parts/Id/Id.js', () => ({
  create: jest.fn(() => 42),
}))

jest.unstable_mockModule('../src/parts/ViewletManager/ViewletManager.js', () => ({
  load: jest.fn(),
}))

jest.unstable_mockModule('../src/parts/ViewletModule/ViewletModule.js', () => ({
  load: jest.fn(),
}))

const HeadlessLayout = await import('../src/parts/HeadlessLayout/HeadlessLayout.js')
const ViewletManager = await import('../src/parts/ViewletManager/ViewletManager.js')
const ViewletModule = await import('../src/parts/ViewletModule/ViewletModule.js')

test('initialize - creates Layout without rendering child components', async () => {
  const initData = {
    Layout: {
      bounds: {
        windowHeight: 768,
        windowWidth: 1024,
      },
    },
  }

  await HeadlessLayout.initialize(initData)

  const expectedViewlet = {
    disposed: false,
    focus: false,
    getModule: ViewletModule.load,
    id: 'Layout',
    render: false,
    shouldRenderEvents: false,
    show: false,
    type: 0,
    uid: 42,
    uri: '',
  }
  expect(ViewletManager.load).toHaveBeenCalledTimes(1)
  // @ts-ignore
  expect(ViewletManager.load.mock.calls[0]).toEqual([expectedViewlet, false, false, { ...initData, restore: false }])
})
