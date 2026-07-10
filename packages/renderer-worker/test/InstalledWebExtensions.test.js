import { beforeEach, expect, jest, test } from '@jest/globals'

const storage = Object.create(null)

jest.unstable_mockModule('../src/parts/ExtensionMeta/ExtensionMeta.js', () => ({
  addWebExtension: jest.fn(),
}))

jest.unstable_mockModule('../src/parts/FilePicker/FilePicker.js', () => ({
  showDirectoryPicker: jest.fn(),
}))

jest.unstable_mockModule('../src/parts/LocalStorage/LocalStorage.js', () => ({
  getJson: jest.fn(async (/** @type {string} */ key) => storage[key]),
  setJson: jest.fn(async (key, value) => {
    // @ts-ignore
    storage[key] = value
  }),
}))

jest.unstable_mockModule('../src/parts/PersistentFileHandle/PersistentFileHandle.js', () => ({
  addHandle: jest.fn(),
}))

jest.unstable_mockModule('../src/parts/Platform/Platform.js', () => ({
  getPlatform: jest.fn(() => 1),
}))

jest.unstable_mockModule('../src/parts/RendererProcess/RendererProcess.js', () => ({
  invoke: jest.fn(async (method) => {
    if (method === 'Location.getHref') {
      return 'https://example.com/'
    }
    throw new Error(`unexpected method ${method}`)
  }),
}))

const ExtensionMeta = await import('../src/parts/ExtensionMeta/ExtensionMeta.js')
const FilePicker = await import('../src/parts/FilePicker/FilePicker.js')
const InstalledWebExtensions = await import('../src/parts/InstalledWebExtensions/InstalledWebExtensions.js')
const LocalStorage = await import('../src/parts/LocalStorage/LocalStorage.js')
const PersistentFileHandle = await import('../src/parts/PersistentFileHandle/PersistentFileHandle.js')

const createDirectoryHandle = (manifest) => {
  return {
    getFileHandle: jest.fn(async () => ({
      getFile: jest.fn(async () => ({
        text: jest.fn(async () => JSON.stringify(manifest)),
      })),
    })),
    kind: 'directory',
    name: 'sample-extension',
  }
}

beforeEach(() => {
  jest.clearAllMocks()
  for (const key of Object.keys(storage)) {
    delete storage[key]
  }
})

test('installFromDisk', async () => {
  const handle = createDirectoryHandle({
    browser: 'dist/main.js',
    id: 'sample.extension',
  })
  // @ts-ignore
  FilePicker.showDirectoryPicker.mockResolvedValue(handle)

  await InstalledWebExtensions.installFromDisk()

  expect(FilePicker.showDirectoryPicker).toHaveBeenCalledWith({ mode: 'read' })
  expect(PersistentFileHandle.addHandle).toHaveBeenCalledWith('local-extension://sample.extension', handle)
  expect(ExtensionMeta.addWebExtension).toHaveBeenCalledWith('https://example.com/local-extensions/sample.extension')
  expect(LocalStorage.setJson).toHaveBeenCalledWith('installedWebExtensionsFromDisk', ['sample.extension'])
})

test('installFromDisk ignores canceled picker', async () => {
  // @ts-ignore
  FilePicker.showDirectoryPicker.mockRejectedValue(new DOMException('The user aborted a request.', 'AbortError'))

  await InstalledWebExtensions.installFromDisk()

  expect(PersistentFileHandle.addHandle).not.toHaveBeenCalled()
  expect(ExtensionMeta.addWebExtension).not.toHaveBeenCalled()
})

test('installFromDisk validates manifest', async () => {
  const handle = createDirectoryHandle({ browser: 'dist/main.js' })
  // @ts-ignore
  FilePicker.showDirectoryPicker.mockResolvedValue(handle)

  await expect(InstalledWebExtensions.installFromDisk()).rejects.toThrow(
    'Failed to install extension from disk: TypeError: Extension manifest must have an id',
  )
})

test('restore', async () => {
  storage.installedWebExtensionsFromDisk = ['sample.extension', 'second.extension']

  await InstalledWebExtensions.restore()

  expect(ExtensionMeta.addWebExtension).toHaveBeenNthCalledWith(1, 'https://example.com/local-extensions/sample.extension')
  expect(ExtensionMeta.addWebExtension).toHaveBeenNthCalledWith(2, 'https://example.com/local-extensions/second.extension')
})

test('restore ignores invalid stored values', async () => {
  storage.installedWebExtensionsFromDisk = ['sample.extension', 42, '', null]

  await InstalledWebExtensions.restore()

  expect(ExtensionMeta.addWebExtension).toHaveBeenCalledTimes(1)
})
