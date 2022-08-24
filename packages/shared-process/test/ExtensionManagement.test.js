import { createReadStream, createWriteStream } from 'node:fs'
import {
  access,
  mkdir,
  mkdtemp,
  readdir,
  readFile,
  rm,
  writeFile,
} from 'node:fs/promises'
import http from 'node:http'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { pipeline } from 'node:stream/promises'
import { constants, createBrotliCompress } from 'node:zlib'
import getPort from 'get-port'
import { jest } from '@jest/globals'
import tar from 'tar-fs'
import VError from 'verror'
import { writeJson } from '../src/parts/JsonFile/JsonFile.js'

jest.unstable_mockModule('../src/parts/Platform/Platform.js', () => ({
  getExtensionsPath: jest.fn(() => {
    throw new Error('not implemented')
  }),
  getBuiltinExtensionsPath: jest.fn(() => {
    throw new Error('not implemented')
  }),
  getDisabledExtensionsPath: jest.fn(() => {
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
}))

const ExtensionManagement = await import(
  '../src/parts/ExtensionManagement/ExtensionManagement.js'
)
const Platform = await import('../src/parts/Platform/Platform.js')

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
    createWriteStream(outFile)
  )
}

const createExtensionTarBr = async (files) => {
  const folder = '/tmp/extension-test/test-author.test-extension'
  await rm(folder, { force: true, recursive: true })
  await mkdir(folder, { recursive: true })
  for (const [filePath, content] of Object.entries(files)) {
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

// TODO this test is flaky sometimes: Jest has detected the following 1 open handle potentially keeping Jest from exiting: ●  JSSTREAM
test.skip('install', async () => {
  await createExtensionTarBr({
    'extension.json': `{
  "id": "test-author.test-extension",
  "name": "test-extension",
  "publisher": "test-author",
  "version": "0.0.1",
  "main": "main.js"
}
`,
    'main.js': 'export const activate = () => { console.info("hello world") }',
    'package.json': '{ "type" : "module" }',
  })
  handler = async (request, response) => {
    switch (request.url) {
      case '/download/test-author.test-extension':
        response.statusCode = 200
        await pipeline(
          createReadStream(
            '/tmp/extension-test/test-author.test-extension.tar.br'
          ),
          response
        )
        break
      default:
        response.statusCode = 404
        response.end()
        break
    }
  }
  const tmpDir = await getTmpDir()
  // @ts-ignore
  Platform.getExtensionsPath.mockImplementation(() => tmpDir)
  await ExtensionManagement.install('test-author.test-extension')
  expect(
    await readFile(
      join(tmpDir, 'test-author.test-extension/extension.json'),
      'utf-8'
    )
  ).toBe(`{
  "id": "test-author.test-extension",
  "name": "test-extension",
  "publisher": "test-author",
  "version": "0.0.1",
  "main": "main.js"
}
`)
  expect(
    await readFile(join(tmpDir, 'test-author.test-extension/main.js'), 'utf-8')
  ).toBe('export const activate = () => { console.info("hello world") }')
  expect(
    await readFile(
      join(tmpDir, 'test-author.test-extension/package.json'),
      'utf-8'
    )
  ).toBe('{ "type" : "module" }')
})

test('install should fail when the server sends a bad status code', async () => {
  handler = (request, response) => {
    switch (request.url) {
      default:
        response.statusCode = 404
        return response.end()
    }
  }
  const tmpDir = await getTmpDir()
  const tmpDir2 = await getTmpDir()
  // @ts-ignore
  Platform.getExtensionsPath.mockImplementation(() => tmpDir)
  // @ts-ignore
  Platform.getCachedExtensionsPath.mockImplementation(() => tmpDir2)
  await expect(
    ExtensionManagement.install('test-author.test-extension')
  ).rejects.toThrowError(
    /Failed to install extension "test-author.test-extension": Failed to download "http:\/\/localhost:\d+\/download\/test-author.test-extension": Response code 404 \(Not Found\)/
  )
})

test('install should fail when the server sends an invalid compressed object', async () => {
  // TODO avoid side effect in tests, use createServer
  handler = (request, res) => {
    switch (request.url) {
      case '/download/test-author.test-extension':
        res.statusCode = 200
        return res.end('abc')
      default:
        res.statusCode = 404
        return res.end()
    }
  }
  const tmpDir = await getTmpDir()
  // @ts-ignore
  Platform.getExtensionsPath.mockImplementation(() => tmpDir)
  await expect(
    ExtensionManagement.install('test-author.test-extension')
  ).rejects.toThrowError(
    /^Failed to install extension "test-author.test-extension": unexpected end of file/
  )
})

test('uninstall', async () => {
  const tmpDir = await getTmpDir()
  // @ts-ignore
  Platform.getExtensionsPath.mockImplementation(() => tmpDir)
  await mkdir(join(tmpDir, 'test-author.test-extension'))
  expect(await exists(join(tmpDir, 'test-author.test-extension'))).toBe(true)
  await ExtensionManagement.uninstall('test-author.test-extension')
  expect(await exists(join(tmpDir, 'test-author.test-extension'))).toBe(false)
})

test("uninstall should fail when extension doesn't exist", async () => {
  const tmpDir = await getTmpDir()
  // @ts-ignore
  Platform.getExtensionsPath.mockImplementation(() => tmpDir)
  await expect(
    ExtensionManagement.uninstall('test-author.test-extension')
  ).rejects.toThrowError(
    /^Failed to uninstall extension "test-author.test-extension": ENOENT: no such file or directory/
  )
})

// TODO test for extension main not found (extension host)

// TODO test for extension json not found (extension host)

// TODO test for extension code import fails (extension host)
// TODO test for extension activation fails (in extension host)
// TODO test for extension deactivation fails (in extension host)
// TODO test for global unhandlederror/unhandledrejection (in extension host)

test('getAllExtensions', async () => {
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
  Platform.getExtensionsPath.mockImplementation(() => tmpDir1)
  // @ts-ignore
  Platform.getBuiltinExtensionsPath.mockImplementation(() => tmpDir2)
  // @ts-ignore
  Platform.getDisabledExtensionsPath.mockImplementation(() => tmpDir3)
  // @ts-ignore
  Platform.getOnlyExtensionPath.mockImplementation(() => undefined)
  expect(await ExtensionManagement.getAllExtensions()).toEqual([
    {
      status: 'fulfilled',
      id: 'builtin-extension',
      path: join(tmpDir2, 'builtin-extension'),
    },
    {
      status: 'fulfilled',
      id: 'test-extension',
      path: join(tmpDir1, 'test-extension'),
    },
  ])
})

test('getAllExtensions - invalid extension.json', async () => {
  const spy = jest.spyOn(console, 'warn').mockImplementation(() => {})
  const tmpDir1 = await getTmpDir()
  const manifestPath = join(tmpDir1, 'test-extension', 'extension.json')
  await mkdir(dirname(manifestPath))
  await writeFile(manifestPath, '{invalid json}')
  const tmpDir2 = await getTmpDir()
  const tmpDir3 = await getTmpDir()
  // @ts-ignore
  Platform.getExtensionsPath.mockImplementation(() => tmpDir1)
  // @ts-ignore
  Platform.getBuiltinExtensionsPath.mockImplementation(() => tmpDir2)
  // @ts-ignore
  Platform.getDisabledExtensionsPath.mockImplementation(() => tmpDir3)
  // @ts-ignore
  Platform.getOnlyExtensionPath.mockImplementation(() => undefined)
  expect(await ExtensionManagement.getAllExtensions()).toEqual([
    {
      path: join(tmpDir1, 'test-extension'),
      reason: new VError(
        'Failed to load extension "test-extension": Failed to load extension manifest: JSON parsing error:'
      ),
      status: 'rejected',
    },
  ])
})

test('disable', async () => {
  const tmpDir1 = await getTmpDir()
  const tmpDir2 = await getTmpDir()
  await mkdir(join(tmpDir1, 'test-extension'))
  await writeFile(join(tmpDir1, 'test-extension', 'extension.json'), '{}')
  // @ts-ignore
  Platform.getExtensionsPath.mockImplementation(() => tmpDir1)
  // @ts-ignore
  Platform.getDisabledExtensionsPath.mockImplementation(() => tmpDir2)
  await ExtensionManagement.disable('test-extension')
  expect(await readdir(tmpDir1)).toEqual([])
  expect(await readdir(tmpDir2)).toEqual(['test-extension'])
})

test('disable should fail if enabled extension path does not exist', async () => {
  const tmpDir1 = await getTmpDir()
  const tmpDir2 = await getTmpDir()
  await mkdir(join(tmpDir1, 'test-extension'))
  await writeFile(join(tmpDir1, 'test-extension', 'extension.json'), '{}')
  // @ts-ignore
  Platform.getExtensionsPath.mockImplementation(() => tmpDir1)
  // @ts-ignore
  Platform.getDisabledExtensionsPath.mockImplementation(() => tmpDir2)
  const nonExistentPath1 = join(tmpDir1, 'non-existent-extension')
  const nonExistentPath2 = join(tmpDir2, 'non-existent-extension')
  await expect(
    ExtensionManagement.disable('non-existent-extension')
  ).rejects.toThrowError(
    `Failed to disable extension non-existent-extension: ENOENT: no such file or directory, rename '${nonExistentPath1}' -> '${nonExistentPath2}'`
  )
})

test.skip('getExtensions - empty object', async () => {
  const tmpDir1 = await getTmpDir()
  const tmpDir2 = await getTmpDir()
  const tmpDir3 = await getTmpDir()
  await mkdir(join(tmpDir1, 'test-extension-1'))
  await writeFile(join(tmpDir1, 'test-extension-1', 'extension.json'), '{}')
  // @ts-ignore
  Platform.getBuiltinExtensionsPath.mockImplementation(() => tmpDir1)
  // @ts-ignore
  Platform.getDisabledExtensionsPath.mockImplementation(() => tmpDir2)
  // @ts-ignore
  Platform.getCachedExtensionsPath.mockImplementation(() => tmpDir3)
  expect(await ExtensionManagement.getExtensions()).toEqual([
    {
      status: 'fulfilled',
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
  Platform.getBuiltinExtensionsPath.mockImplementation(() => tmpDir1)
  // @ts-ignore
  Platform.getExtensionsPath.mockImplementation(() => tmpDir2)
  expect(await ExtensionManagement.getExtensions()).toEqual([
    {
      status: 'fulfilled',

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
  Platform.getBuiltinExtensionsPath.mockImplementation(() => tmpDir1)
  // @ts-ignore
  Platform.getExtensionsPath.mockImplementation(() => tmpDir2)
  // @ts-ignore
  Platform.getOnlyExtensionPath.mockImplementation(() => undefined)
  expect(await ExtensionManagement.getExtensions()).toEqual([
    {
      status: 'rejected',
      reason: new VError(
        'Failed to load extension "test-extension-1": Failed to load extension manifest: Invalid manifest file: Not an JSON object.'
      ),
      path: join(tmpDir1, 'test-extension-1'),
    },
  ])
})

test('getExtensions - error - invalid value - string', async () => {
  const tmpDir1 = await getTmpDir()
  const tmpDir2 = await getTmpDir()
  await mkdir(join(tmpDir1, 'test-extension-1'))
  await writeFile(join(tmpDir1, 'test-extension-1', 'extension.json'), '""')
  // @ts-ignore
  Platform.getBuiltinExtensionsPath.mockImplementation(() => tmpDir1)
  // @ts-ignore
  Platform.getExtensionsPath.mockImplementation(() => tmpDir2)
  // @ts-ignore
  Platform.getOnlyExtensionPath.mockImplementation(() => undefined)
  expect(await ExtensionManagement.getExtensions()).toEqual([
    {
      status: 'rejected',
      reason: new VError(
        'Failed to load extension "test-extension-1": Failed to load extension manifest: Invalid manifest file: Not an JSON object.'
      ),
      path: join(tmpDir1, 'test-extension-1'),
    },
  ])
})

test('getExtensions - error - invalid value - number', async () => {
  const tmpDir1 = await getTmpDir()
  const tmpDir2 = await getTmpDir()
  await mkdir(join(tmpDir1, 'test-extension-1'))
  await writeFile(join(tmpDir1, 'test-extension-1', 'extension.json'), '42')
  // @ts-ignore
  Platform.getBuiltinExtensionsPath.mockImplementation(() => tmpDir1)
  // @ts-ignore
  Platform.getExtensionsPath.mockImplementation(() => tmpDir2)
  // @ts-ignore
  Platform.getOnlyExtensionPath.mockImplementation(() => undefined)
  expect(await ExtensionManagement.getExtensions()).toEqual([
    {
      status: 'rejected',
      reason: new VError(
        'Failed to load extension "test-extension-1": Failed to load extension manifest: Invalid manifest file: Not an JSON object.'
      ),
      path: join(tmpDir1, 'test-extension-1'),
    },
  ])
})

test('getExtensions - error - invalid value - boolean', async () => {
  const tmpDir1 = await getTmpDir()
  const tmpDir2 = await getTmpDir()
  await mkdir(join(tmpDir1, 'test-extension-1'))
  await writeFile(join(tmpDir1, 'test-extension-1', 'extension.json'), 'true')
  // @ts-ignore
  Platform.getBuiltinExtensionsPath.mockImplementation(() => tmpDir1)
  // @ts-ignore
  Platform.getDisabledExtensionsPath.mockImplementation(() => tmpDir2)
  // @ts-ignore
  Platform.getOnlyExtensionPath.mockImplementation(() => undefined)
  expect(await ExtensionManagement.getExtensions()).toEqual([
    {
      status: 'rejected',
      reason: new VError(
        'Failed to load extension "test-extension-1": Failed to load extension manifest: Invalid manifest file: Not an JSON object.'
      ),
      path: join(tmpDir1, 'test-extension-1'),
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
  Platform.getBuiltinExtensionsPath.mockImplementation(() => tmpDir1)
  // @ts-ignore
  Platform.getExtensionsPath.mockImplementation(() => tmpDir2)
  // @ts-ignore
  Platform.getOnlyExtensionPath.mockImplementation(() => undefined)
  expect(await ExtensionManagement.getExtensions()).toEqual([
    {
      reason: new VError(
        'Failed to load extension "test-extension-1": Failed to load extension manifest: Unexpected end of JSON input while parsing "{"'
      ),
      status: 'rejected',
      path: join(tmpDir1, 'test-extension-1'),
    },
  ])
})

test('getExtensions - error - manifest not found', async () => {
  const tmpDir1 = await getTmpDir()
  const tmpDir2 = await getTmpDir()
  await mkdir(join(tmpDir1, 'test-extension-1'))
  // @ts-ignore
  Platform.getBuiltinExtensionsPath.mockImplementation(() => tmpDir1)
  // @ts-ignore
  Platform.getExtensionsPath.mockImplementation(() => tmpDir2)
  // @ts-ignore
  Platform.getOnlyExtensionPath.mockImplementation(() => undefined)
  const manifestPath = join(tmpDir1, 'test-extension-1', 'extension.json')
  expect(await ExtensionManagement.getExtensions()).toEqual([
    {
      status: 'rejected',
      reason: new VError(
        `Failed to load extension "test-extension-1": Failed to load extension manifest: File not found '${manifestPath}'`
      ),
      path: join(tmpDir1, 'test-extension-1'),
    },
  ])
})

test('getExtensions - with only extension and builtin extensions', async () => {
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
  Platform.getBuiltinExtensionsPath.mockImplementation(() => tmpDir1)
  // @ts-ignore
  Platform.getExtensionsPath.mockImplementation(() => tmpDir2)
  // @ts-ignore
  Platform.getOnlyExtensionPath.mockImplementation(() => tmpDir3)
  expect(await ExtensionManagement.getExtensions()).toEqual([
    {
      id: 'language-basics-xyz',
      languages: [
        {
          id: 'xyz',
        },
      ],
      path: tmpDir3,
      status: 'fulfilled',
    },
  ])
})
