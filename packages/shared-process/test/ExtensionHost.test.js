import { afterEach, expect, jest, test } from '@jest/globals'
import { mkdir, mkdtemp, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

afterEach(() => {
  jest.restoreAllMocks()
})

jest.unstable_mockModule('../src/parts/PlatformPaths/PlatformPaths.js', () => ({
  getExtensionHostPath: jest.fn(() => {
    throw new Error('not implemented')
  }),
  getLogsDir: jest.fn(() => {
    return ''
  }),
  getConfigDir: jest.fn(() => {
    return ''
  }),
}))

const ExtensionHost = await import('../src/parts/ExtensionHost/ExtensionHost.js')

const PlatformPaths = await import('../src/parts/PlatformPaths/PlatformPaths.js')

const ExtensionManagement = await import('../src/parts/ExtensionManagement/ExtensionManagement.js')

const getTmpDir = () => {
  return mkdtemp(join(tmpdir(), 'foo-'))
}

test.skip('start / stop', async () => {
  await ExtensionHost.start()
  ExtensionHost.dispose()
})

test('start - error - path not found', async () => {
  // @ts-ignore
  PlatformPaths.getExtensionHostPath.mockImplementation(() => {
    return '/test'
  })
  const socket = {
    on() {},
  }
  await expect(ExtensionHost.start(socket)).rejects.toThrow(new Error('Failed to start extension host: Extension Host exited with code 1'))
})

test('start - error - path is a directory', async () => {
  const tmpDir = await getTmpDir()
  // @ts-ignore
  PlatformPaths.getExtensionHostPath.mockImplementation(() => {
    return tmpDir
  })
  const socket = {
    on() {},
  }
  await mkdir(tmpDir, { recursive: true })
  // TODO error message should include stderr of extension host
  await expect(ExtensionHost.start(socket)).rejects.toThrow(new Error('Failed to start extension host: Extension Host exited with code 1'))
})

// TODO test is flaky
test.skip('start - error - syntax error', async () => {
  const tmpDir = await getTmpDir()
  const extensionHostPath = join(tmpDir, 'extensionHost.js')
  await writeFile(extensionHostPath, '...')
  // @ts-ignore
  PlatformPaths.getExtensionHostPath.mockImplementation(() => {
    return extensionHostPath
  })
  const socket = {
    on() {},
  }
  // TODO error message should include stderr of extension host: SyntaxError: Unexpected end of input
  await expect(ExtensionHost.start(socket)).rejects.toThrow(new Error('Failed to start extension host: Extension Host exited with code 1'))
})

test('start - error - uncaught exception', async () => {
  const tmpDir = await getTmpDir()
  const extensionHostPath = join(tmpDir, 'extensionHost.js')
  await writeFile(extensionHostPath, "throw new Error('oops')")
  // @ts-ignore
  PlatformPaths.getExtensionHostPath.mockImplementation(() => {
    return extensionHostPath
  })
  const socket = {
    on() {},
  }
  // TODO error message should include stderr of extension host: SyntaxError: Unexpected end of input
  await expect(ExtensionHost.start(socket)).rejects.toThrow(new Error('Failed to start extension host: Extension Host exited with code 1'))
})

test('start - error - custom exit code', async () => {
  const tmpDir = await getTmpDir()
  const extensionHostPath = join(tmpDir, 'extensionHost.js')
  await writeFile(extensionHostPath, 'process.exit(123)')
  // @ts-ignore
  PlatformPaths.getExtensionHostPath.mockImplementation(() => {
    return extensionHostPath
  })
  const socket = {
    on() {},
  }
  await expect(ExtensionHost.start(socket)).rejects.toThrow(new Error('Failed to start extension host: Extension Host exited with code 123'))
})

test('start - child process should be closed when socket immediately is closed', async () => {
  const tmpDir = await getTmpDir()
  const extensionHostPath = join(tmpDir, 'extensionHost.js')
  await writeFile(extensionHostPath, 'process.on(`message`, ()=>{})')
  // @ts-ignore
  PlatformPaths.getExtensionHostPath.mockImplementation(() => {
    return extensionHostPath
  })
  const socket = {
    on(event, listener) {
      if (event === 'close') {
        listener()
      }
    },
  }
  await ExtensionHost.start(socket)
})
