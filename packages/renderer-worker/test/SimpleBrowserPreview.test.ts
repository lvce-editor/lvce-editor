import { beforeEach, expect, jest, test } from '@jest/globals'

jest.unstable_mockModule('../src/parts/ViewletManager/ViewletManager.js', () => ({ load: jest.fn() }))
jest.unstable_mockModule('../src/parts/RendererProcess/RendererProcess.js', () => ({ invoke: jest.fn() }))
jest.unstable_mockModule('../src/parts/Viewlet/Viewlet.js', () => ({ resize: jest.fn(), dispose: jest.fn(), executeViewletCommand: jest.fn() }))

const ViewletManager = await import('../src/parts/ViewletManager/ViewletManager.js')
const RendererProcess = await import('../src/parts/RendererProcess/RendererProcess.js')
const Viewlet = await import('../src/parts/Viewlet/Viewlet.js')
const Preview = await import('../src/parts/SimpleBrowserPreview/SimpleBrowserPreview.js')

beforeEach(() => jest.resetAllMocks())

test('creates a detached child preview with the exact decoded URI and content bounds', async () => {
  jest.mocked(ViewletManager.load).mockResolvedValue([['create']])
  const tab = await Preview.materialize(
    { uid: 7, x: 10, y: 20, width: 300, height: 200, headerHeight: 65 },
    {
      iframeSrc: 'html-preview:///file%3A%2F%2F%2Fa%20%23%25.html',
    },
  )
  expect(ViewletManager.load).toHaveBeenCalledWith(
    expect.objectContaining({
      type: 0,
      id: 'Preview',
      uid: tab.previewUid,
      parentUid: 7,
      show: false,
      uri: 'file:///a #%.html',
      x: 10,
      y: 85,
      width: 300,
      height: 135,
    }),
  )
  expect(RendererProcess.invoke).toHaveBeenCalledWith('Viewlet.sendMultiple', [['create']])
  expect(await Preview.materialize({}, tab)).toBe(tab)
  expect(ViewletManager.load).toHaveBeenCalledTimes(1)
})

test('resize updates all materialized previews while leaving native tabs alone', async () => {
  jest.mocked(Viewlet.resize).mockResolvedValue([['resize']])
  await Preview.resize({
    x: 20,
    y: 30,
    width: 400,
    height: 250,
    headerHeight: 65,
    tabs: [{ previewUid: 10 }, { browserViewId: 20 }, { previewUid: 11 }],
  })
  expect(Viewlet.resize).toHaveBeenCalledTimes(2)
  expect(Viewlet.resize).toHaveBeenCalledWith(10, { x: 20, y: 95, width: 400, height: 185 })
  expect(Viewlet.resize).toHaveBeenCalledWith(11, { x: 20, y: 95, width: 400, height: 185 })
  expect(RendererProcess.invoke).toHaveBeenCalledWith('Viewlet.sendMultiple', [['resize'], ['resize']])
})
