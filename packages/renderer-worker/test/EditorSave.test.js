import { jest } from '@jest/globals'
import { VError } from '../src/parts/VError/VError.js'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/FileSystem/FileSystem.js', () => {
  return {
    writeFile: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})
jest.unstable_mockModule('../src/parts/ErrorHandling/ErrorHandling.js', () => {
  return {
    handleError: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})
jest.unstable_mockModule('../src/parts/Preferences/Preferences.js', () => {
  return {
    get: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})
jest.unstable_mockModule(
  '../src/parts/EditorCommand/EditorCommandFormat.js',
  () => {
    return {
      format: jest.fn(() => {
        throw new Error('not implemented')
      }),
    }
  }
)

const FileSystem = await import('../src/parts/FileSystem/FileSystem.js')
const Preferences = await import('../src/parts/Preferences/Preferences.js')

const ErrorHandling = await import(
  '../src/parts/ErrorHandling/ErrorHandling.js'
)

const EditorSave = await import(
  '../src/parts/EditorCommand/EditorCommandSave.js'
)
const EditorFormat = await import(
  '../src/parts/EditorCommand/EditorCommandFormat.js'
)

test('editorSave', async () => {
  const editor = {
    uri: '/tmp/some-file.txt',
    lines: ['line 1', 'line 2'],
  }
  // @ts-ignore
  FileSystem.writeFile.mockImplementation(() => {
    return null
  })
  expect(await EditorSave.save(editor)).toBe(editor)
  expect(FileSystem.writeFile).toHaveBeenCalledWith(
    '/tmp/some-file.txt',
    'line 1\nline 2'
  )
})

test('editorSave - error with fileSystem', async () => {
  const editor = {
    uri: '/tmp/some-file.txt',
    lines: ['line 1', 'line 2'],
  }
  // @ts-ignore
  FileSystem.writeFile.mockImplementation(() => {
    throw new TypeError('x is not a function')
  })
  // @ts-ignore
  ErrorHandling.handleError.mockImplementation(() => {})
  await EditorSave.save(editor)
  expect(ErrorHandling.handleError).toHaveBeenCalledTimes(1)
  expect(ErrorHandling.handleError).toHaveBeenCalledWith(
    new VError(
      'Failed to save file "/tmp/some-file.txt": TypeError: x is not a function'
    ) // TODO test error.cause once available in jest
  )
})

test('editorSave - with formatting', async () => {
  // @ts-ignore
  FileSystem.writeFile.mockImplementation(() => {
    throw new TypeError('x is not a function')
  })
  // @ts-ignore
  ErrorHandling.handleError.mockImplementation(() => {})
  // @ts-ignore
  Preferences.get.mockImplementation(() => {
    return true
  })
  // @ts-ignore
  EditorFormat.format.mockImplementation((editor) => {
    return {
      ...editor,
      lines: ['b'],
    }
  })
  const editor = {
    uri: '/test/file.txt',
    lines: ['a'],
  }
  await EditorSave.save(editor)
  expect(EditorFormat.format).toHaveBeenCalledTimes(1)
  expect(EditorFormat.format).toHaveBeenCalledWith(editor)
  expect(FileSystem.writeFile).toHaveBeenCalledTimes(1)
  expect(FileSystem.writeFile).toHaveBeenCalledWith('/test/file.txt', `b`)
})
