import { expect, jest, test, beforeAll, afterAll, afterEach } from '@jest/globals'
import getPort from 'get-port'
import { createWriteStream } from 'node:fs'
import { access, mkdir, mkdtemp, readdir, readFile, rm, writeFile } from 'node:fs/promises'
import http from 'node:http'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { pipeline } from 'node:stream/promises'
import { constants, createBrotliCompress } from 'node:zlib'
import tar from 'tar-fs'
import * as ExtensionManifestStatus from '../src/parts/ExtensionManifestStatus/ExtensionManifestStatus.js'
import { writeJson } from '../src/parts/JsonFile/JsonFile.js'
import { VError } from '../src/parts/VError/VError.js'

jest.unstable_mockModule('../src/parts/PlatformPaths/PlatformPaths.js', () => ({
  getExtensionsPath: jest.fn(() => {
    throw new Error('not implemented')
  }),
  getBuiltinExtensionsPath: jest.fn(() => {
    throw new Error('not implemented')
  }),
  getDisabledExtensionsPath: jest.fn(() => {
    throw new Error('not implemented')
  }),
  getDisabledExtensionsJsonPath: jest.fn(() => {
    throw new Error('not implemented')
  }),
  getMarketplaceUrl: jest.fn(() => {
    return marketplaceUrl
  }),
  getCachedExtensionsPath: jest.fn(() => {
    throw new Error('not implemented')
  }),
  getOnlyExtensionPath: jest.fn(() => {
    throw new Error('not implemented')
  }),
  getLinkedExtensionsPath: jest.fn(() => {
    throw new Error('not implemented')
  }),
}))

const ExtensionManagement = await import('../src/parts/ExtensionManagement/ExtensionManagement.js')
const PlatformPaths = await import('../src/parts/PlatformPaths/PlatformPaths.js')

const getTmpDir = () => {
  return mkdtemp(join(tmpdir(), 'foo-'))
}

const exists = async (path) => {
  try {
    await access(path)
    return true
  } catch {
    return false
  }
}

/**
 * @param {string} inDir
 * @param {string} outFile
 */
export const compress = async (inDir, outFile) => {
  await mkdir(dirname(outFile), { recursive: true })
  await pipeline(
    tar.pack(inDir),
    createBrotliCompress({
      params: {
        [constants.BROTLI_PARAM_QUALITY]: constants.BROTLI_MIN_QUALITY,
      },
    }),
    createWriteStream(outFile),
  )
}

const createExtensionTarBr = async (files) => {
  const folder = '/tmp/extension-test/test-author.test-extension'
  await rm(folder, { force: true, recursive: true })
  await mkdir(folder, { recursive: true })
  for (const [filePath, content] of Object.entries(files)) {
    // @ts-ignore
    await writeFile(`${folder}/${filePath}`, content)
  }
  await compress(folder, `${folder}.tar.br`)
}

let server
let handler
let marketplaceUrl

beforeAll(async () => {
  const port = await getPort()
  server = http.createServer((request, response) => {
    handler(request, response)
  })
  await new Promise((resolve) => {
    server.listen(port, () => {
      resolve(undefined)
    })
  })
  marketplaceUrl = `http://localhost:${port}`
})

afterAll(() => {
  server.close()
})

afterEach(() => {
  jest.restoreAllMocks()
})

test('uninstall', async () => {
  const tmpDir = await getTmpDir()
  // @ts-ignore
  PlatformPaths.getExtensionsPath.mockImplementation(() => tmpDir)
  await mkdir(join(tmpDir, 'test-author.test-extension'))
  expect(await exists(join(tmpDir, 'test-author.test-extension'))).toBe(true)
  await ExtensionManagement.uninstall('test-author.test-extension')
  expect(await exists(join(tmpDir, 'test-author.test-extension'))).toBe(false)
})

test("uninstall should fail when extension doesn't exist", async () => {
  const tmpDir = await getTmpDir()
  // @ts-ignore
  PlatformPaths.getExtensionsPath.mockImplementation(() => tmpDir)
  await expect(ExtensionManagement.uninstall('test-author.test-extension')).rejects.toThrow(
    /^Failed to uninstall extension "test-author.test-extension": ENOENT: no such file or directory/,
  )
})

// TODO test for extension main not found (extension host)

// TODO test for extension json not found (extension host)

// TODO test for extension code import fails (extension host)
// TODO test for extension activation fails (in extension host)
// TODO test for extension deactivation fails (in extension host)
// TODO test for global unhandlederror/unhandledrejection (in extension host)

test.skip('getExtensions', async () => {
  const tmpDir1 = await getTmpDir()
  const manifestPath1 = join(tmpDir1, 'test-extension', 'extension.json')
  await mkdir(dirname(manifestPath1))
  await writeFile(manifestPath1, JSON.stringify({ id: 'test-extension' }))
  const tmpDir2 = await getTmpDir()
  const manifestPath2 = join(tmpDir2, 'builtin-extension', 'extension.json')
  await mkdir(dirname(manifestPath2))
  await writeFile(manifestPath2, JSON.stringify({ id: 'builtin-extension' }))
  const tmpDir3 = await getTmpDir()
  // @ts-ignore
  PlatformPaths.getExtensionsPath.mockImplementation(() => tmpDir1)
  // @ts-ignore
  PlatformPaths.getBuiltinExtensionsPath.mockImplementation(() => tmpDir2)
  // @ts-ignore
  PlatformPaths.getDisabledExtensionsPath.mockImplementation(() => tmpDir3)
  // @ts-ignore
  PlatformPaths.getOnlyExtensionPath.mockImplementation(() => undefined)
  // @ts-ignore
  PlatformPaths.getLinkedExtensionsPath.mockImplementation(() => undefined)
  expect(await ExtensionManagement.getExtensions()).toEqual([
    {
      status: ExtensionManifestStatus.Resolved,
      id: 'test-extension',
      path: join(tmpDir1, 'test-extension'),
    },
    {
      status: ExtensionManifestStatus.Resolved,
      id: 'builtin-extension',
      path: join(tmpDir2, 'builtin-extension'),
    },
  ])
})

test('getExtensions - invalid extension.json', async () => {
  const spy = jest.spyOn(console, 'warn').mockImplementation(() => {})
  const tmpDir1 = await getTmpDir()
  const manifestPath = join(tmpDir1, 'test-extension', 'extension.json')
  await mkdir(dirname(manifestPath))
  await writeFile(manifestPath, '{invalid json}')
  const tmpDir2 = await getTmpDir()
  const tmpDir3 = await getTmpDir()
  // @ts-ignore
  PlatformPaths.getExtensionsPath.mockImplementation(() => tmpDir1)
  // @ts-ignore
  PlatformPaths.getBuiltinExtensionsPath.mockImplementation(() => tmpDir2)
  // @ts-ignore
  PlatformPaths.getDisabledExtensionsPath.mockImplementation(() => tmpDir3)
  // @ts-ignore
  PlatformPaths.getDisabledExtensionsJsonPath.mockImplementation(() => join(tmpDir3, 'disabled-extensions.json'))
  // @ts-ignore
  PlatformPaths.getOnlyExtensionPath.mockImplementation(() => undefined)
  // @ts-ignore
  PlatformPaths.getLinkedExtensionsPath.mockImplementation(() => undefined)
  expect(await ExtensionManagement.getExtensions()).toEqual([
    {
      path: join(tmpDir1, 'test-extension'),
      reason: new VError(
        `Failed to load extension manifest for test-extension: Failed to parse json at ${join(
          tmpDir1,
          'test-extension',
          'extension.json',
        )}: SyntaxError: Expected property name or '}' in JSON at position 1 (line 1 column 2)`,
      ),
      status: ExtensionManifestStatus.Rejected,
      disabled: false,
    },
  ])
})

test('disable', async () => {
  const tmpDir1 = await getTmpDir()
  const tmpDir2 = await getTmpDir()
  const tmpDir3 = await getTmpDir()
  await mkdir(join(tmpDir1, 'test-extension'))
  await writeFile(join(tmpDir1, 'test-extension', 'extension.json'), '{}')
  // @ts-ignore
  PlatformPaths.getExtensionsPath.mockImplementation(() => tmpDir1)
  // @ts-ignore
  PlatformPaths.getDisabledExtensionsPath.mockImplementation(() => tmpDir2)
  // @ts-ignore
  PlatformPaths.getDisabledExtensionsJsonPath.mockImplementation(() => join(tmpDir3, 'disabled-extensions.json'))
  await ExtensionManagement.disable('test-extension')
  const content = await readFile(join(tmpDir3, 'disabled-extensions.json'), 'utf8')
  const parsed = JSON.parse(content)
  expect(parsed.disabledExtensions).toEqual(['test-extension'])
})

test('enable', async () => {
  const tmpDir = await getTmpDir()
  const disabledExtensionsJsonPath = join(tmpDir, 'disabled-extensions.json')
  await writeFile(disabledExtensionsJsonPath, JSON.stringify({ disabledExtensions: ['test-extension-1', 'test-extension-2'] }, null, 2) + '\n')
  // @ts-ignore
  PlatformPaths.getDisabledExtensionsJsonPath.mockImplementation(() => disabledExtensionsJsonPath)
  await ExtensionManagement.enable('test-extension-1')
  const content = await readFile(disabledExtensionsJsonPath, 'utf8')
  const parsed = JSON.parse(content)
  expect(parsed.disabledExtensions).toEqual(['test-extension-2'])
})

test('enable - extension not in disabled list', async () => {
  const tmpDir = await getTmpDir()
  const disabledExtensionsJsonPath = join(tmpDir, 'disabled-extensions.json')
  await writeFile(disabledExtensionsJsonPath, JSON.stringify({ disabledExtensions: ['test-extension-1'] }, null, 2) + '\n')
  // @ts-ignore
  PlatformPaths.getDisabledExtensionsJsonPath.mockImplementation(() => disabledExtensionsJsonPath)
  await ExtensionManagement.enable('test-extension-2')
  const content = await readFile(disabledExtensionsJsonPath, 'utf8')
  const parsed = JSON.parse(content)
  expect(parsed.disabledExtensions).toEqual(['test-extension-1'])
})

test.skip('disable should fail if enabled extension path does not exist', async () => {
  const tmpDir1 = await getTmpDir()
  const tmpDir2 = await getTmpDir()
  await mkdir(join(tmpDir1, 'test-extension'))
  await writeFile(join(tmpDir1, 'test-extension', 'extension.json'), '{}')
  // @ts-ignore
  PlatformPaths.getExtensionsPath.mockImplementation(() => tmpDir1)
  // @ts-ignore
  PlatformPaths.getDisabledExtensionsPath.mockImplementation(() => tmpDir2)
  const nonExistentPath1 = join(tmpDir1, 'non-existent-extension')
  const nonExistentPath2 = join(tmpDir2, 'non-existent-extension')
  await expect(ExtensionManagement.disable('non-existent-extension')).rejects.toThrow(
    `Failed to disable extension non-existent-extension: ENOENT: no such file or directory, rename '${nonExistentPath1}' -> '${nonExistentPath2}'`,
  )
})

test.skip('getExtensions - empty object', async () => {
  const tmpDir1 = await getTmpDir()
  const tmpDir2 = await getTmpDir()
  const tmpDir3 = await getTmpDir()
  await mkdir(join(tmpDir1, 'test-extension-1'))
  await writeFile(join(tmpDir1, 'test-extension-1', 'extension.json'), '{}')
  // @ts-ignore
  PlatformPaths.getBuiltinExtensionsPath.mockImplementation(() => tmpDir1)
  // @ts-ignore
  PlatformPaths.getDisabledExtensionsPath.mockImplementation(() => tmpDir2)
  // @ts-ignore
  PlatformPaths.getCachedExtensionsPath.mockImplementation(() => tmpDir3)
  expect(await ExtensionManagement.getExtensions()).toEqual([
    {
      status: ExtensionManifestStatus.Resolved,
      path: join(tmpDir1, '/test-extension-1'),
    },
  ])
})

test.skip('getExtensions - error - invalid value - empty array', async () => {
  const tmpDir1 = await getTmpDir()
  const tmpDir2 = await getTmpDir()
  await mkdir(join(tmpDir1, 'test-extension-1'))
  await writeFile(join(tmpDir1, 'test-extension-1', 'extension.json'), '[]')
  // @ts-ignore
  PlatformPaths.getBuiltinExtensionsPath.mockImplementation(() => tmpDir1)
  // @ts-ignore
  PlatformPaths.getExtensionsPath.mockImplementation(() => tmpDir2)
  expect(await ExtensionManagement.getExtensions()).toEqual([
    {
      status: ExtensionManifestStatus.Resolved,

      path: join(tmpDir1, 'test-extension-1'),
    },
  ])
})

test('getExtensions - error - invalid value - null', async () => {
  const tmpDir1 = await getTmpDir()
  const tmpDir2 = await getTmpDir()
  await mkdir(join(tmpDir1, 'test-extension-1'))
  await writeFile(join(tmpDir1, 'test-extension-1', 'extension.json'), 'null')
  // @ts-ignore
  PlatformPaths.getBuiltinExtensionsPath.mockImplementation(() => tmpDir1)
  // @ts-ignore
  PlatformPaths.getExtensionsPath.mockImplementation(() => tmpDir2)
  // @ts-ignore
  PlatformPaths.getOnlyExtensionPath.mockImplementation(() => undefined)
  // @ts-ignore
  PlatformPaths.getLinkedExtensionsPath.mockImplementation(() => undefined)
  expect(await ExtensionManagement.getExtensions()).toEqual([
    {
      status: ExtensionManifestStatus.Rejected,
      reason: new VError('Failed to load extension manifest for test-extension-1: Invalid manifest file: Not an JSON object.'),
      path: join(tmpDir1, 'test-extension-1'),
      builtin: true,
      disabled: false,
    },
  ])
})

test('getExtensions - error - invalid value - string', async () => {
  const tmpDir1 = await getTmpDir()
  const tmpDir2 = await getTmpDir()
  await mkdir(join(tmpDir1, 'test-extension-1'))
  await writeFile(join(tmpDir1, 'test-extension-1', 'extension.json'), '""')
  // @ts-ignore
  PlatformPaths.getBuiltinExtensionsPath.mockImplementation(() => tmpDir1)
  // @ts-ignore
  PlatformPaths.getExtensionsPath.mockImplementation(() => tmpDir2)
  // @ts-ignore
  PlatformPaths.getOnlyExtensionPath.mockImplementation(() => undefined)
  // @ts-ignore
  PlatformPaths.getLinkedExtensionsPath.mockImplementation(() => undefined)
  expect(await ExtensionManagement.getExtensions()).toEqual([
    {
      status: ExtensionManifestStatus.Rejected,
      reason: new VError('Failed to load extension manifest for test-extension-1: Invalid manifest file: Not an JSON object.'),
      path: join(tmpDir1, 'test-extension-1'),
      builtin: true,
      disabled: false,
    },
  ])
})

test('getExtensions - error - invalid value - number', async () => {
  const tmpDir1 = await getTmpDir()
  const tmpDir2 = await getTmpDir()
  await mkdir(join(tmpDir1, 'test-extension-1'))
  await writeFile(join(tmpDir1, 'test-extension-1', 'extension.json'), '42')
  // @ts-ignore
  PlatformPaths.getBuiltinExtensionsPath.mockImplementation(() => tmpDir1)
  // @ts-ignore
  PlatformPaths.getExtensionsPath.mockImplementation(() => tmpDir2)
  // @ts-ignore
  PlatformPaths.getOnlyExtensionPath.mockImplementation(() => undefined)
  // @ts-ignore
  PlatformPaths.getLinkedExtensionsPath.mockImplementation(() => undefined)
  expect(await ExtensionManagement.getExtensions()).toEqual([
    {
      status: ExtensionManifestStatus.Rejected,
      reason: new VError('Failed to load extension manifest for test-extension-1: Invalid manifest file: Not an JSON object.'),
      path: join(tmpDir1, 'test-extension-1'),
      builtin: true,
      disabled: false,
    },
  ])
})

test('getExtensions - error - invalid value - boolean', async () => {
  const tmpDir1 = await getTmpDir()
  const tmpDir2 = await getTmpDir()
  await mkdir(join(tmpDir1, 'test-extension-1'))
  await writeFile(join(tmpDir1, 'test-extension-1', 'extension.json'), 'true')
  // @ts-ignore
  PlatformPaths.getBuiltinExtensionsPath.mockImplementation(() => tmpDir1)
  // @ts-ignore
  PlatformPaths.getDisabledExtensionsPath.mockImplementation(() => tmpDir2)
  // @ts-ignore
  PlatformPaths.getOnlyExtensionPath.mockImplementation(() => undefined)
  // @ts-ignore
  PlatformPaths.getLinkedExtensionsPath.mockImplementation(() => undefined)
  expect(await ExtensionManagement.getExtensions()).toEqual([
    {
      status: ExtensionManifestStatus.Rejected,
      reason: new VError('Failed to load extension manifest for test-extension-1: Invalid manifest file: Not an JSON object.'),
      path: join(tmpDir1, 'test-extension-1'),
      builtin: true,
      disabled: false,
    },
  ])
})

// TODO should have better error message here and also stack
test('getExtensions - error - invalid json', async () => {
  const tmpDir1 = await getTmpDir()
  const tmpDir2 = await getTmpDir()
  await mkdir(join(tmpDir1, 'test-extension-1'))
  await writeFile(join(tmpDir1, 'test-extension-1', 'extension.json'), '{')
  // @ts-ignore
  PlatformPaths.getBuiltinExtensionsPath.mockImplementation(() => tmpDir1)
  // @ts-ignore
  PlatformPaths.getExtensionsPath.mockImplementation(() => tmpDir2)
  // @ts-ignore
  PlatformPaths.getOnlyExtensionPath.mockImplementation(() => undefined)
  // @ts-ignore
  PlatformPaths.getLinkedExtensionsPath.mockImplementation(() => undefined)
  expect(await ExtensionManagement.getExtensions()).toEqual([
    {
      reason: new VError(
        `Failed to load extension manifest for test-extension-1: Failed to parse json at ${join(
          tmpDir1,
          'test-extension-1',
          'extension.json',
        )}: SyntaxError: Expected property name or '}' in JSON at position 1 (line 1 column 2)`,
      ),
      status: ExtensionManifestStatus.Rejected,
      path: join(tmpDir1, 'test-extension-1'),
      builtin: true,
      disabled: false,
    },
  ])
})

test.skip('getExtensions - error - manifest not found', async () => {
  const tmpDir1 = await getTmpDir()
  const tmpDir2 = await getTmpDir()
  await mkdir(join(tmpDir1, 'test-extension-1'))
  // @ts-ignore
  PlatformPaths.getBuiltinExtensionsPath.mockImplementation(() => tmpDir1)
  // @ts-ignore
  PlatformPaths.getExtensionsPath.mockImplementation(() => tmpDir2)
  // @ts-ignore
  PlatformPaths.getOnlyExtensionPath.mockImplementation(() => undefined)
  // @ts-ignore
  PlatformPaths.getLinkedExtensionsPath.mockImplementation(() => '')
  const manifestPath = join(tmpDir1, 'test-extension-1', 'extension.json')
  expect(await ExtensionManagement.getExtensions()).toEqual([
    {
      status: ExtensionManifestStatus.Rejected,
      reason: new VError(`Failed to load extension "test-extension-1": Failed to load extension manifest: File not found '${manifestPath}'`),
      path: join(tmpDir1, 'test-extension-1'),
    },
  ])
})

test.skip('getExtensions - with only extension and builtin extensions', async () => {
  const tmpDir1 = await getTmpDir()
  const tmpDir2 = await getTmpDir()
  const tmpDir3 = await getTmpDir()
  await mkdir(join(tmpDir1, 'test-extension-1'))
  await writeJson(join(tmpDir1, 'test-extension-1', 'extension.json'), {
    id: 'language-basics-xyz',
  })
  await writeJson(join(tmpDir3, 'extension.json'), {
    id: 'language-basics-xyz',
    languages: [
      {
        id: 'xyz',
      },
    ],
  })
  // @ts-ignore
  PlatformPaths.getBuiltinExtensionsPath.mockImplementation(() => tmpDir1)
  // @ts-ignore
  PlatformPaths.getExtensionsPath.mockImplementation(() => tmpDir2)
  // @ts-ignore
  PlatformPaths.getOnlyExtensionPath.mockImplementation(() => tmpDir3)
  // @ts-ignore
  PlatformPaths.getLinkedExtensionsPath.mockImplementation(() => '')
  expect(await ExtensionManagement.getExtensions()).toEqual([
    {
      id: 'language-basics-xyz',
      languages: [
        {
          id: 'xyz',
        },
      ],
      path: tmpDir3,
      status: ExtensionManifestStatus.Resolved,
    },
  ])
})
