import * as ViewletMap from '../src/parts/ViewletMap/ViewletMap.js'
import * as ViewletModuleId from '../src/parts/ViewletModuleId/ViewletModuleId.js'

test('png', () => {
  expect(ViewletMap.getId('/test/file.png')).toBe(ViewletModuleId.EditorImage)
})

test('svg', () => {
  expect(ViewletMap.getId('/test/file.svg')).toBe(ViewletModuleId.EditorImage)
})

test('ogg', () => {
  expect(ViewletMap.getId('/test/file.ogg')).toBe(ViewletModuleId.Audio)
})

test('mp4', () => {
  expect(ViewletMap.getId('/test/file.mp4')).toBe(ViewletModuleId.Video)
})

test('pdf', () => {
  expect(ViewletMap.getId('/test/file.pdf')).toBe(ViewletModuleId.Pdf)
})
