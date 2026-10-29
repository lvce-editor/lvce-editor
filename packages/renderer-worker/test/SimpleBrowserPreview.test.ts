import { beforeEach, expect, jest, test } from '@jest/globals'

jest.unstable_mockModule('../src/parts/ViewletManager/ViewletManager.js', () => ({ load: jest.fn() }))
jest.unstable_mockModule('../src/parts/RendererProcess/RendererProcess.js', () => ({ invoke: jest.fn() }))
jest.unstable_mockModule('../src/parts/Viewlet/Viewlet.js', () => ({ resize: jest.fn(), dispose: jest.fn(), executeViewletCommand: jest.fn() }))

const ViewletManager = await import('../src/parts/ViewletManager/ViewletManager.js')
const RendererProcess = await import('../src/parts/RendererProcess/RendererProcess.js')
const Viewlet = await import('../src/parts/Viewlet/Viewlet.js')
const ViewletStates = await import('../src/parts/ViewletStates/ViewletStates.js')
const Preview = await import('../src/parts/SimpleBrowserPreview/SimpleBrowserPreview.js')

beforeEach(() => {
  jest.resetAllMocks()
  ViewletStates.reset()
})

test('creates a detached child preview with the exact decoded URI and content bounds', async () => {
  jest.mocked(ViewletManager.load).mockImplementation(async ({ uid }) => {
    ViewletStates.set(uid, {
      factory: {},
      renderedState: { title: 'my favorite file', uid },
      state: { title: 'my favorite file', uid },
    })
    return [['create']]
  })
  const tab = await Preview.materialize(
    { uid: 7, x: 10, y: 20, width: 300, height: 200, headerHeight: 65 },
    {
      iframeSrc: 'html-preview:///file%3A%2F%2F%2Fa%20%23%25.html',
    },
  )
  expect(tab.title).toBe('my favorite file')
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

test('registers a preview child id on its parent before loading the child', async () => {
  jest.mocked(ViewletManager.load).mockResolvedValue([['create']])
  const tab = { iframeSrc: 'html-preview:///file%3A%2F%2F%2Ffirst.html' }
  const parentState = { selectedTabIndex: 0, tabs: [tab], uid: 7 }
  const renderedState = { ...parentState }
  const factory = { name: 'SimpleBrowser' }
  ViewletStates.set(7, { factory, renderedState, state: parentState })

  const result = await Preview.materialize({ ...parentState, x: 0, y: 0, width: 300, height: 200, headerHeight: 65 }, tab)

  expect(ViewletStates.getState(7).tabs[0].previewUid).toBe(result.previewUid)
  expect(ViewletStates.getInstance(7).renderedState.tabs[0].previewUid).toBe(result.previewUid)
})

test('materializes and reloads a readable memfs preview URL', async () => {
  jest.mocked(ViewletManager.load).mockResolvedValue([['create']])
  const iframeSrc = 'html-preview:///memfs/inventing-on-principles.html'
  const tab = await Preview.materialize({ uid: 7, x: 10, y: 20, width: 300, height: 200, headerHeight: 65 }, { iframeSrc })

  expect(ViewletManager.load).toHaveBeenCalledWith(expect.objectContaining({ uri: 'memfs://inventing-on-principles.html' }))

  await Preview.reload(tab)

  expect(Viewlet.executeViewletCommand).toHaveBeenCalledWith(tab.previewUid, 'setUri', 'memfs://inventing-on-principles.html')
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

test('materializes HTTP URLs using the sandboxed iframe host without an Electron view', async () => {
  jest.mocked(ViewletManager.load).mockResolvedValue([['create']])
  const url = 'https://remote.example.com/preview/grant/nested?query=1#section'
  const tab = await Preview.materialize({ uid: 7, x: 0, y: 0, width: 300, height: 200, headerHeight: 65 }, { iframeSrc: url })
  expect(ViewletManager.load).toHaveBeenCalledWith(
    expect.objectContaining({ id: 'ExtensionView', uri: `browser-iframe:///${encodeURIComponent(url)}`, parentUid: 7 }),
  )
  await Preview.reload(tab)
  expect(Viewlet.executeViewletCommand).toHaveBeenCalledWith(tab.previewUid, 'reloadBrowserIframe')
})

test('HTTP materialization leaves the parent DOM snapshot unchanged until its own render', async () => {
  jest.mocked(ViewletManager.load).mockResolvedValue([['create']])
  const tab = { iframeSrc: 'https://remote.example.com/preview/grant/' }
  const parent = { uid: 7, tabs: [tab], selectedTabIndex: 0 }
  ViewletStates.set(7, { factory: {}, renderedState: parent, state: parent })
  const materialized = await Preview.materialize({ ...parent, x: 0, y: 0, width: 300, height: 200, headerHeight: 65 }, tab)
  expect(materialized.previewUid).toEqual(expect.any(Number))
  expect(ViewletStates.getInstance(7).renderedState).toBe(parent)
  expect(ViewletStates.getInstance(7).renderedState.tabs[0]).not.toHaveProperty('previewUid')
})
