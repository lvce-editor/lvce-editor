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

test('secrets', async () => {
  expect(await ViewletMap.getModuleId('secrets://')).toBe(ViewletModuleId.Secrets)
})

test('search editor', async () => {
  expect(await ViewletMap.getModuleId('search-editor://1/Search')).toBe(ViewletModuleId.Search)
})

test('inline diff uses the external diff editor', async () => {
  expect(await ViewletMap.getModuleId('inline-diff://data://before<->/test/file.ts')).toBe(ViewletModuleId.DiffEditor)
})
