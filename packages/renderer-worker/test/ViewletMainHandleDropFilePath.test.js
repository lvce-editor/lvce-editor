import { jest } from '@jest/globals'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/RendererProcess/RendererProcess.js', () => {
  return {
    invoke: jest.fn(),
  }
})

jest.unstable_mockModule('../src/parts/ViewletMap/ViewletMap.js', () => {
  return {
    getId: jest.fn(() => {
      return 'Test'
    }),
  }
})

jest.unstable_mockModule('../src/parts/ViewletManager/ViewletManager.js', () => {
  return {
    create() {
      return {}
    },
    load: jest.fn(),
  }
})

jest.unstable_mockModule('../src/parts/Id/Id.js', () => {
  return {
    create: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})

jest.unstable_mockModule('../src/parts/Viewlet/Viewlet.js', () => {
  return {
    resize: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})

const ViewletMainHandleDropFilePath = await import('../src/parts/ViewletMain/ViewletMainHandleDropFilePath.js')
const RendererProcess = await import('../src/parts/RendererProcess/RendererProcess.js')
const ViewletMap = await import('../src/parts/ViewletMap/ViewletMap.js')
const Viewlet = await import('../src/parts/Viewlet/Viewlet.js')
const ViewletManager = await import('../src/parts/ViewletManager/ViewletManager.js')
const Id = await import('../src/parts/Id/Id.js')

test('handleDropFilePath - split right', async () => {
  // @ts-ignore
  ViewletMap.getId.mockImplementation(() => {
    return 'Test'
  })
  // @ts-ignore
  ViewletManager.load.mockImplementation(() => {
    return []
  })
  // @ts-ignore
  Id.create.mockImplementation(() => {
    return 62
  })
  // @ts-ignore
  Viewlet.resize.mockImplementation(() => {
    return []
  })
  const state = {
    x: 0,
    y: 20,
    width: 564,
    height: 574,
    tabHeight: 35,
    grid: [
      {
        id: 'Test',
        x: 0,
        y: 55,
        height: 539,
        width: 564,
        childCount: 1,
        uri: '/test/file-1.txt',
        uid: 60,
      },
      {
        id: 'Test',
        x: 0,
        y: 90,
        height: 504,
        width: 564,
        childCount: 0,
        uid: 61,
      },
    ],
  }
  const eventX = 511
  const eventY = 161
  const filePath = '/test/file-2.txt'
  expect(await ViewletMainHandleDropFilePath.handleDropFilePath(state, eventX, eventY, filePath)).toBe(state)
  expect(RendererProcess.invoke).toHaveBeenCalledTimes(1)
  expect(RendererProcess.invoke).toHaveBeenNthCalledWith(1, 'Viewlet.sendMultiple', [
    ['Viewlet.setBounds', 61, 0, 35, 282, 574],
    ['Viewlet.setBounds', 61, 0, 35, 282, 574],
    ['Viewlet.setBounds', 60, 0, 0, 282, 35],
    ['Viewlet.send', 'Main', 'stopHighlightDragOver'],
    ['Viewlet.send', 'Main', 'hideDragOverlay'],
    ['Viewlet.create', 'MainTabs', 62],
    ['Viewlet.send', 62, 'setTabs', [{ label: 'file-2.txt', title: '/test/file-2.txt' }]],
    ['Viewlet.setBounds', 62, 283, 0, 281, 35],
    ['Viewlet.appendCustom', 'Main', 'appendTabs', 62],
    ['Viewlet.send', 'Main', 'addSash', '', 280, 0, 4, 574],
  ])
})
