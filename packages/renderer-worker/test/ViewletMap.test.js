import * as ViewletMap from '../src/parts/ViewletMap/ViewletMap.js'
import * as ViewletModuleId from '../src/parts/ViewletModuleId/ViewletModuleId.js'

test('image - png', () => {
  expect(ViewletMap.getModuleId('/test/file.png')).toBe(ViewletModuleId.EditorImage)
})

test('image - svg', () => {
  expect(ViewletMap.getModuleId('/test/file.svg')).toBe(ViewletModuleId.EditorImage)
})

test('audio - ogg', () => {
  expect(ViewletMap.getModuleId('/test/file.ogg')).toBe(ViewletModuleId.Audio)
})

test('video - mp4', () => {
  expect(ViewletMap.getModuleId('/test/file.mp4')).toBe(ViewletModuleId.Video)
})

test('video - webm', () => {
  expect(ViewletMap.getModuleId('/test/file.webm')).toBe(ViewletModuleId.Video)
})

test('video - mkv', () => {
  expect(ViewletMap.getModuleId('/test/file.mkv')).toBe(ViewletModuleId.Video)
})

test('pdf - pdf', () => {
  expect(ViewletMap.getModuleId('/test/file.pdf')).toBe(ViewletModuleId.Pdf)
})

test('audio - opus', () => {
  expect(ViewletMap.getModuleId('/test/file.opus')).toBe(ViewletModuleId.Audio)
})
