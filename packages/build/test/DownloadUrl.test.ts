import { afterEach, expect, test } from '@jest/globals'
import { createServer } from 'node:http'
import { existsSync, readFileSync } from 'node:fs'
import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import type { Server } from 'node:http'
import { downloadUrl } from '../src/parts/DownloadUrl/DownloadUrl.ts'

const servers: Server[] = []
const directories: string[] = []

afterEach(async () => {
  await Promise.all(servers.splice(0).map((server) => new Promise((resolve) => server.close(resolve))))
  await Promise.all(directories.splice(0).map((directory) => rm(directory, { recursive: true, force: true })))
})

const createTestServer = async (handler) => {
  const server = createServer(handler)
  servers.push(server)
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', () => resolve()))
  const address = server.address()
  if (!address || typeof address === 'string') {
    throw new Error('Expected test server to have a TCP address')
  }
  return `http://127.0.0.1:${address.port}/download`
}

const createOutputFile = async () => {
  const directory = await mkdtemp(join(tmpdir(), 'lvce-download-url-'))
  directories.push(directory)
  return join(directory, 'extension.tar.br')
}

test('retries a transient HTTP failure with a fresh request and output', async () => {
  let requests = 0
  const url = await createTestServer((_request, response) => {
    requests++
    if (requests === 1) {
      response.writeHead(500)
      response.end('temporary failure')
      return
    }
    response.end('valid archive')
  })
  const outFile = await createOutputFile()

  await downloadUrl(url, outFile, { retryDelayMs: 0 })

  expect(requests).toBe(2)
  expect(readFileSync(outFile, 'utf8')).toBe('valid archive')
})

test('stops after the retry limit and removes the partial output', async () => {
  let requests = 0
  const url = await createTestServer((_request, response) => {
    requests++
    response.writeHead(500)
    response.end('temporary failure')
  })
  const outFile = await createOutputFile()

  await expect(downloadUrl(url, outFile, { retryDelayMs: 0 })).rejects.toThrow(/status code 500/)

  expect(requests).toBe(3)
  expect(existsSync(outFile)).toBe(false)
})

test('does not retry permanent HTTP failures', async () => {
  let requests = 0
  const url = await createTestServer((_request, response) => {
    requests++
    response.writeHead(404)
    response.end('not found')
  })
  const outFile = await createOutputFile()

  await expect(downloadUrl(url, outFile, { retryDelayMs: 0 })).rejects.toThrow(/status code 404/)

  expect(requests).toBe(1)
  expect(existsSync(outFile)).toBe(false)
})

test('does not concatenate bytes after an interrupted response', async () => {
  let requests = 0
  const url = await createTestServer((_request, response) => {
    requests++
    if (requests === 1) {
      response.write('partial archive')
      response.destroy()
      return
    }
    response.end('valid archive')
  })
  const outFile = await createOutputFile()

  await downloadUrl(url, outFile, { retryDelayMs: 0 })

  expect(requests).toBe(2)
  expect(readFileSync(outFile, 'utf8')).toBe('valid archive')
})

test('does not retry output filesystem failures', async () => {
  let requests = 0
  const url = await createTestServer((_request, response) => {
    requests++
    response.end('valid archive')
  })
  const directory = await mkdtemp(join(tmpdir(), 'lvce-download-url-output-'))
  directories.push(directory)

  await expect(downloadUrl(url, directory, { retryDelayMs: 0 })).rejects.toThrow()

  expect(requests).toBeLessThanOrEqual(1)
})
