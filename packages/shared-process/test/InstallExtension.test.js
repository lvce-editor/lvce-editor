import { jest } from '@jest/globals'
import getPort from 'get-port'
import { createReadStream, createWriteStream } from 'node:fs'
import { access, mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import http from 'node:http'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { pipeline } from 'node:stream/promises'
import { constants, createBrotliCompress } from 'node:zlib'
import tar from 'tar-fs'

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
  getLinkedExtensionsPath: jest.fn(() => {
    throw new Error('not implemented')
  }),
}))

const InstallExtension = await import('../src/parts/InstallExtension/InstallExtension.js')
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
        await pipeline(createReadStream('/tmp/extension-test/test-author.test-extension.tar.br'), response)
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
  await InstallExtension.installExtension('test-author.test-extension')
  expect(await readFile(join(tmpDir, 'test-author.test-extension/extension.json'), 'utf-8')).toBe(`{
  "id": "test-author.test-extension",
  "name": "test-extension",
  "publisher": "test-author",
  "version": "0.0.1",
  "main": "main.js"
}
`)
  expect(await readFile(join(tmpDir, 'test-author.test-extension/main.js'), 'utf-8')).toBe(
    'export const activate = () => { console.info("hello world") }'
  )
  expect(await readFile(join(tmpDir, 'test-author.test-extension/package.json'), 'utf-8')).toBe('{ "type" : "module" }')
})

// TODO test is flaky https://github.com/lvce-editor/lvce-editor/actions/runs/3684799038/jobs/6234968296
// probably should use unit test instead of e2e test here
test.skip('install should fail when the server sends a bad status code', async () => {
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
  await expect(InstallExtension.installExtension('test-author.test-extension')).rejects.toThrowError(
    /Failed to install extension "test-author.test-extension": Failed to download "http:\/\/localhost:\d+\/download\/test-author.test-extension": Response code 404 \(Not Found\)/
  )
})

test('install should fail when the server sends an invalid compressed object', async () => {
  const tmpDir1 = await getTmpDir()
  const tmpDir2 = await getTmpDir()
  const tmpDir3 = await getTmpDir()
  const tmpDir4 = await getTmpDir()
  // @ts-ignore
  Platform.getExtensionsPath.mockImplementation(() => tmpDir1)
  // @ts-ignore
  Platform.getBuiltinExtensionsPath.mockImplementation(() => tmpDir2)
  // @ts-ignore
  Platform.getDisabledExtensionsPath.mockImplementation(() => tmpDir3)
  // @ts-ignore
  Platform.getOnlyExtensionPath.mockImplementation(() => undefined)
  // @ts-ignore
  Platform.getLinkedExtensionsPath.mockImplementation(() => undefined)
  // @ts-ignore
  Platform.getCachedExtensionsPath.mockImplementation(() => tmpDir4)
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
  await expect(InstallExtension.installExtension('test-author.test-extension')).rejects.toThrowError(
    /^Failed to install extension "test-author.test-extension": Failed to extract .* unexpected end of file/
  )
})
