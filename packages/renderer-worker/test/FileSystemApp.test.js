import { jest } from '@jest/globals'
import * as FileSytemErrorCodes from '../src/parts/FileSystemErrorCodes/FileSystemErrorCodes.js'

beforeEach(() => {
  jest.resetAllMocks()
})

class NodeError extends Error {
  constructor(code, message = code) {
    super(code + ':' + message)
    this.code = code
  }
}

jest.unstable_mockModule(
  '../src/parts/RendererProcess/RendererProcess.js',
  () => {
    return {
      invoke: jest.fn(() => {
        throw new Error('not implemented')
      }),
    }
  }
)
jest.unstable_mockModule('../src/parts/FileSystem/FileSystem.js', () => {
  return {
    readFile: jest.fn(() => {
      throw new Error('not implemented')
    }),
    writeFile: jest.fn(() => {
      throw new Error('not implemented')
    }),
    mkdir: jest.fn(() => {
      throw new Error('not implemented')
    }),
    getPathSeparator: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})

jest.unstable_mockModule('../src/parts/Platform/Platform.js', () => {
  return {
    getUserSettingsPath: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})

jest.unstable_mockModule('../src/parts/Workspace/Workspace.js', () => {
  return {
    pathDirName(path) {
      return path.slice(0, path.lastIndexOf('/'))
    },
  }
})

const FileSystemApp = await import('../src/parts/FileSystem/FileSystemApp.js')
const Platform = await import('../src/parts/Platform/Platform.js')
const FileSystem = await import('../src/parts/FileSystem/FileSystem.js')

test('readFile - settings', async () => {
  // @ts-ignore
  Platform.getUserSettingsPath.mockImplementation(() => {
    return '~/.config/app/settings.json'
  })
  // @ts-ignore
  FileSystem.readFile.mockImplementation(() => {
    return '{}'
  })
  expect(await FileSystemApp.readFile('settings.json')).toBe('{}')
})

test('readFile - settings - error', async () => {
  // @ts-ignore
  Platform.getUserSettingsPath.mockImplementation(() => {
    throw new TypeError('x is not a function')
  })
  // @ts-ignore
  FileSystem.readFile.mockImplementation(() => {
    return '{}'
  })
  await expect(FileSystemApp.readFile('settings.json')).rejects.toThrowError(
    new TypeError('x is not a function')
  )
})

test('rename - error', async () => {
  await expect(
    FileSystemApp.rename('settings.json', 'new-settings.json')
  ).rejects.toThrowError(new Error('not allowed'))
})

test('remove - error', async () => {
  await expect(FileSystemApp.remove('settings.json')).rejects.toThrowError(
    new Error('not allowed')
  )
})

test('mkdir - error', async () => {
  await expect(FileSystemApp.mkdir('my-folder')).rejects.toThrowError(
    new Error('not allowed')
  )
})

// TODO test writeFile and writeFile errors

test('readFile - settings - error - file does not exist', async () => {
  // @ts-ignore
  Platform.getUserSettingsPath.mockImplementation(() => {
    return '~/.config/app/settings.json'
  })
  // @ts-ignore
  FileSystem.mkdir.mockImplementation(() => {})
  // @ts-ignore
  FileSystem.getPathSeparator.mockImplementation(() => {
    return '/'
  })
  let i = 0
  // @ts-ignore
  FileSystem.readFile.mockImplementation((uri) => {
    if (i++ === 0) {
      throw new NodeError(FileSytemErrorCodes.ENOENT)
    } else {
      // ignore
    }
  })
  expect(await FileSystemApp.readFile('settings.json')).toBe('{}')
  expect(FileSystem.writeFile).toHaveBeenCalledTimes(1)
  expect(FileSystem.writeFile).toHaveBeenNthCalledWith(
    1,
    '~/.config/app/settings.json',
    '{}'
  )
  expect(FileSystem.readFile).toHaveBeenCalledTimes(1)
  expect(FileSystem.readFile).toHaveBeenCalledWith(
    '~/.config/app/settings.json'
  )
})

test('writeFile - settings - error parent folder does not exist', async () => {
  // @ts-ignore
  Platform.getUserSettingsPath.mockImplementation(() => {
    return '~/.config/app/settings.json'
  })
  // @ts-ignore
  FileSystem.mkdir.mockImplementation(() => {})
  // @ts-ignore
  FileSystem.getPathSeparator.mockImplementation(() => {
    return '/'
  })
  let i = 0
  // @ts-ignore
  FileSystem.writeFile.mockImplementation((uri) => {
    if (i++ === 0) {
      throw new NodeError(
        FileSytemErrorCodes.ENOENT,
        `Failed to write to file "/test/app-name/settings.json": ENOENT: no such file or directory, open \'/test/app-name/settings.json\'`
      )
    } else {
      // ignore
    }
  })
  await FileSystemApp.writeFile('settings.json', '')
  expect(FileSystem.writeFile).toHaveBeenCalledTimes(2)
  expect(FileSystem.writeFile).toHaveBeenNthCalledWith(
    1,
    '~/.config/app/settings.json',
    ''
  )
  expect(FileSystem.writeFile).toHaveBeenNthCalledWith(
    2,
    '~/.config/app/settings.json',
    ''
  )
  expect(FileSystem.mkdir).toHaveBeenCalledTimes(1)
  expect(FileSystem.mkdir).toHaveBeenCalledWith('~/.config/app')
})
