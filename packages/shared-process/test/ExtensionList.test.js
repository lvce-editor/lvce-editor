import { jest } from '@jest/globals'

jest.unstable_mockModule('../src/parts/Platform/Platform.js', () => ({
  getExtensionsPath: jest.fn(() => {
    return '/test/extensions'
  }),
}))

jest.unstable_mockModule('../src/parts/Download/Download.js', () => ({
  download: jest.fn(() => {
    throw new Error('not implemented')
  }),
}))

jest.unstable_mockModule('../src/parts/Extract/Extract.js', () => ({
  extract: jest.fn(() => {
    throw new Error('not implemented')
  }),
}))
jest.unstable_mockModule('../src/parts/TmpFile/TmpFile.js', () => ({
  getTmpFile: jest.fn(() => {
    return '/test/tmp-file'
  }),
  getTmpDir: jest.fn(() => {
    return '/test/tmp-dir'
  }),
}))

const ExtensionInstall = await import(
  '../src/parts/ExtensionInstall/ExtensionInstall.js'
)
const Download = await import('../src/parts/Download/Download.js')
const Extract = await import('../src/parts/Extract/Extract.js')
const Platform = await import('../src/parts/Platform/Platform.js')

test('list - folder does not exist', () => {})
