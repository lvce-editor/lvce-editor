import { beforeEach, expect, jest, test } from '@jest/globals'
import * as ErrorCodes from '../src/parts/ErrorCodes/ErrorCodes.js'

beforeEach(() => {
  jest.resetModules()
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/FileSystem/FileSystem.js', () => {
  return {
    readFile: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})

jest.unstable_mockModule('../src/parts/Markdown/Markdown.js', () => {
  return {
    toHtml: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})

jest.unstable_mockModule('../src/parts/ExtensionManagement/ExtensionManagement.js', () => {
  return {
    getExtension: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})

jest.unstable_mockModule('../src/parts/ExtensionManagement/ExtensionManagement.js', () => {
  return {
    getExtension: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})

class NodeError extends Error {
  constructor(code, message = code) {
    super(code + ':' + message)
    this.code = code
  }
}

const ViewletExtensionDetail = await import('../src/parts/ViewletExtensionDetail/ViewletExtensionDetail.ts')
const ExtensionManagement = await import('../src/parts/ExtensionManagement/ExtensionManagement.js')
const FileSystem = await import('../src/parts/FileSystem/FileSystem.js')
const Markdown = await import('../src/parts/Markdown/Markdown.js')

test('create', () => {
  // @ts-ignore
  const state = ViewletExtensionDetail.create()
  expect(state).toBeDefined()
})

test('loadContent', async () => {
  // @ts-ignore
  ExtensionManagement.getExtension.mockImplementation(() => {
    return {
      path: '/test/test-extension',
      name: 'Test Extension',
    }
  })
  // @ts-ignore
  FileSystem.readFile.mockImplementation(() => {
    return '# test extension'
  })
  // @ts-ignore
  Markdown.toHtml.mockImplementation(() => {
    return '<h1 id="test-extension">Test Extension</h1>'
  })
  const state = {
    // @ts-ignore
    ...ViewletExtensionDetail.create(),
    uri: 'extension-detail://test-extension',
  }
  expect(await ViewletExtensionDetail.loadContent(state)).toMatchObject({
    sanitizedReadmeHtml: '<h1 id="test-extension">Test Extension</h1>',
    iconSrc: '/icons/extensionDefaultIcon.png',
    name: 'Test Extension',
  })
  expect(ExtensionManagement.getExtension).toHaveBeenCalledTimes(1)
  expect(ExtensionManagement.getExtension).toHaveBeenCalledWith('test-extension')
  expect(FileSystem.readFile).toHaveBeenCalledTimes(1)
  expect(FileSystem.readFile).toHaveBeenCalledWith('/test/test-extension/README.md')
  expect(Markdown.toHtml).toHaveBeenCalledTimes(1)
  expect(Markdown.toHtml).toHaveBeenCalledWith('# test extension', {
    baseUrl: '/test/test-extension',
  })
})

test('loadContent - error - readme not found', async () => {
  // @ts-ignore
  ExtensionManagement.getExtension.mockImplementation(() => {
    return {
      path: '/test/test-extension',
      name: 'Test Extension',
    }
  })
  // @ts-ignore
  FileSystem.readFile.mockImplementation(() => {
    throw new NodeError(ErrorCodes.ENOENT)
  })
  // @ts-ignore
  Markdown.toHtml.mockImplementation(() => {
    return '<h1 id="test-extension">Test Extension</h1>'
  })
  const state = {
    // @ts-ignore
    ...ViewletExtensionDetail.create(),
    uri: 'extension-detail://test-extension',
  }
  expect(await ViewletExtensionDetail.loadContent(state)).toMatchObject({
    sanitizedReadmeHtml: '<h1 id="test-extension">Test Extension</h1>',
    iconSrc: '/icons/extensionDefaultIcon.png',
    name: 'Test Extension',
  })
  expect(ExtensionManagement.getExtension).toHaveBeenCalledTimes(1)
  expect(ExtensionManagement.getExtension).toHaveBeenCalledWith('test-extension')
  expect(FileSystem.readFile).toHaveBeenCalledTimes(1)
  expect(FileSystem.readFile).toHaveBeenCalledWith('/test/test-extension/README.md')
  expect(Markdown.toHtml).toHaveBeenCalledTimes(1)
  expect(Markdown.toHtml).toHaveBeenCalledWith('', {
    baseUrl: '/test/test-extension',
  })
})

test('handleIconError', () => {
  // @ts-ignore
  const state = ViewletExtensionDetail.create()
  expect(ViewletExtensionDetail.handleIconError(state)).toMatchObject({
    iconSrc: '/icons/extensionDefaultIcon.png',
  })
})

test('handleIconError - already has default icon', () => {
  const state = {
    // @ts-ignore
    ...ViewletExtensionDetail.create(),
    iconSrc: '/icons/extensionDefaultIcon.png',
  }
  expect(ViewletExtensionDetail.handleIconError(state)).toBe(state)
})
