import { expect, test } from '@jest/globals'
import * as GetPathDirName from '../src/parts/GetPathDirName/GetPathDirName.js'

test('getPathDirName - posix path', () => {
  expect(GetPathDirName.getPathDirName('/home/test/.config/lvce-oss/keybindings.json')).toBe('/home/test/.config/lvce-oss')
})

test('getPathDirName - windows path', () => {
  expect(GetPathDirName.getPathDirName(String.raw`C:\Users\test\.config\lvce-oss\keybindings.json`)).toBe(String.raw`C:\Users\test\.config\lvce-oss`)
})

test('getPathDirName - windows file uri', () => {
  expect(GetPathDirName.getPathDirName(String.raw`file://C:\Users\test\.config\lvce-oss\keybindings.json`)).toBe(
    String.raw`file://C:\Users\test\.config\lvce-oss`,
  )
})
