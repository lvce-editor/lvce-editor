import { expect, jest, test } from '@jest/globals'

jest.unstable_mockModule('../src/parts/GetExtensionViews/GetExtensionViews.ts', () => ({
  findExtensionView: jest.fn(() => undefined),
  getExtensionViews: jest.fn(async () => []),
}))

const ViewletMap = await import('../src/parts/ViewletMap/ViewletMap.js')
const ViewletModuleId = await import('../src/parts/ViewletModuleId/ViewletModuleId.js')

test('audio - ogg', async () => {
  expect(await ViewletMap.getModuleId('/test/file.ogg')).toBe(ViewletModuleId.Audio)
})

test('video - mp4 without a preview provider', async () => {
  expect(await ViewletMap.getModuleId('/test/file.mp4')).toBe(ViewletModuleId.EditorText)
})

test('video - webm without a preview provider', async () => {
  expect(await ViewletMap.getModuleId('/test/file.webm')).toBe(ViewletModuleId.EditorText)
})

test('video - mkv without a preview provider', async () => {
  expect(await ViewletMap.getModuleId('/test/file.mkv')).toBe(ViewletModuleId.EditorText)
})

test('audio - opus', async () => {
  expect(await ViewletMap.getModuleId('/test/file.opus')).toBe(ViewletModuleId.Audio)
})

test('audio - audio-only webm', async () => {
  expect(await ViewletMap.getModuleId('/test/file.weba')).toBe(ViewletModuleId.Audio)
})

test('process explorer', async () => {
  expect(await ViewletMap.getModuleId('process-explorer://')).toBe(ViewletModuleId.ProcessExplorer)
})

test('file watcher explorer', async () => {
  expect(await ViewletMap.getModuleId('file-watcher-explorer:///')).toBe(ViewletModuleId.FileWatcherExplorer)
})

test('running extensions', async () => {
  expect(await ViewletMap.getModuleId('running-extensions://')).toBe(ViewletModuleId.RunningExtensions)
})

test('workers view', async () => {
  expect(await ViewletMap.getModuleId('workers:///1')).toBe(ViewletModuleId.Workers)
})

test('accounts view', async () => {
  expect(await ViewletMap.getModuleId('accounts:///1')).toBe(ViewletModuleId.Accounts)
})

test('cookie import view', async () => {
  expect(await ViewletMap.getModuleId('cookie-import-view:///firefox/default')).toBe(ViewletModuleId.CookieImport)
})

test('secrets', async () => {
  expect(await ViewletMap.getModuleId('secrets://')).toBe(ViewletModuleId.Secrets)
})

test('search editor', async () => {
  expect(await ViewletMap.getModuleId('search-editor://1/Search')).toBe(ViewletModuleId.Search)
})

test('simple browser history', async () => {
  expect(await ViewletMap.getModuleId('simple-browser-history://')).toBe(ViewletModuleId.SimpleBrowserHistory)
})

test('inline diff uses the external diff editor', async () => {
  expect(await ViewletMap.getModuleId('inline-diff://data://before<->/test/file.ts')).toBe(ViewletModuleId.DiffEditor)
})

test('file preview routing uses only the owning application views', async () => {
  const GetExtensionViews = await import('../src/parts/GetExtensionViews/GetExtensionViews.ts')
  const view = { extensionId: 'sample', icon: '', id: 'sample.counter', title: 'Counter', type: 'preview', selector: ['.count'] }
  const getViews = jest.mocked(GetExtensionViews.getExtensionViews)
  const findView = jest.mocked(GetExtensionViews.findExtensionView)
  getViews.mockImplementationOnce(async (applicationId) => (applicationId === 'preview' ? [view] : []))
  findView.mockImplementationOnce((views) => views[0])

  expect(await ViewletMap.getModuleId('/workspace/first.count', undefined, 'preview')).toBe(ViewletModuleId.ExtensionView)
  expect(getViews).toHaveBeenLastCalledWith('preview')
  expect(await ViewletMap.getModuleId('/workspace/first.count', undefined, 'source')).toBe(ViewletModuleId.EditorText)
  expect(getViews).toHaveBeenLastCalledWith('source')
})

test('explicit preview opener is resolved in the owning application', async () => {
  const GetExtensionViews = await import('../src/parts/GetExtensionViews/GetExtensionViews.ts')
  const view = { extensionId: 'sample', icon: '', id: 'sample.counter', title: 'Counter' }
  jest.mocked(GetExtensionViews.getExtensionViews).mockResolvedValueOnce([view])
  jest.mocked(GetExtensionViews.findExtensionView).mockReturnValueOnce(view)

  expect(await ViewletMap.getModuleId('/workspace/first.count', 'sample.counter', 'preview')).toBe(ViewletModuleId.ExtensionView)
  expect(GetExtensionViews.getExtensionViews).toHaveBeenLastCalledWith('preview')
})
