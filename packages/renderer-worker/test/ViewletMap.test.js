import { expect, test } from '@jest/globals'
import * as ViewletMap from '../src/parts/ViewletMap/ViewletMap.js'
import * as ViewletModuleId from '../src/parts/ViewletModuleId/ViewletModuleId.js'

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
