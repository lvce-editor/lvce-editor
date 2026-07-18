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

test('video - mp4', async () => {
  expect(await ViewletMap.getModuleId('/test/file.mp4')).toBe(ViewletModuleId.Video)
})

test('video - webm', async () => {
  expect(await ViewletMap.getModuleId('/test/file.webm')).toBe(ViewletModuleId.Video)
})

test('video - mkv', async () => {
  expect(await ViewletMap.getModuleId('/test/file.mkv')).toBe(ViewletModuleId.Video)
})

test('audio - opus', async () => {
  expect(await ViewletMap.getModuleId('/test/file.opus')).toBe(ViewletModuleId.Audio)
})

test('process explorer', async () => {
  expect(await ViewletMap.getModuleId('process-explorer://')).toBe(ViewletModuleId.ProcessExplorer)
})

test('running extensions', async () => {
  expect(await ViewletMap.getModuleId('running-extensions://')).toBe(ViewletModuleId.RunningExtensions)
})

test('inline diff uses the external diff editor', async () => {
  expect(await ViewletMap.getModuleId('inline-diff://data://before<->/test/file.ts')).toBe(ViewletModuleId.DiffEditor)
})
