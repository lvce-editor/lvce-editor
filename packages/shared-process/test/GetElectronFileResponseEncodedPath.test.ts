import { afterEach, expect, test } from '@jest/globals'
import { mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import * as GetElectronFileResponse from '../src/parts/GetElectronFileResponse/GetElectronFileResponse.js'

const temporaryDirectories: string[] = []

afterEach(async () => {
  const directories = [...temporaryDirectories]
  temporaryDirectories.length = 0
  await Promise.all(directories.map((directory) => rm(directory, { force: true, recursive: true })))
})

test('serves a remote file whose name contains a space', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'lvce-remote-file-'))
  temporaryDirectories.push(directory)
  const filePath = join(directory, 'sample image.png')
  const content = Buffer.from('sample image')
  await writeFile(filePath, content)

  const response = await GetElectronFileResponse.getElectronFileResponse(`/remote${encodeURI(filePath)}`, undefined)

  expect(response.init.status).toBe(200)
  expect(response.body).toEqual(content)
})

test('serves a requested byte range for a remote file', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'lvce-remote-file-'))
  temporaryDirectories.push(directory)
  const filePath = join(directory, 'sample.mp4')
  await writeFile(filePath, Buffer.from('0123456789'))

  const response = await GetElectronFileResponse.getElectronFileResponse(`/remote${encodeURI(filePath)}`, {
    headers: {
      range: 'bytes=2-5',
    },
  })

  expect(response.init.status).toBe(206)
  expect(response.init.headers).toMatchObject({
    'Accept-Ranges': 'bytes',
    'Content-Length': '4',
    'Content-Range': 'bytes 2-5/10',
  })
  expect(response.body).toEqual(Buffer.from('2345'))
})

test('returns range-not-satisfiable for an invalid remote file range', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'lvce-remote-file-'))
  temporaryDirectories.push(directory)
  const filePath = join(directory, 'sample.mp4')
  await writeFile(filePath, Buffer.from('0123456789'))

  const response = await GetElectronFileResponse.getElectronFileResponse(`/remote${encodeURI(filePath)}`, {
    headers: {
      range: 'bytes=10-',
    },
  })

  expect(response.init.status).toBe(416)
  expect(response.init.headers).toMatchObject({
    'Accept-Ranges': 'bytes',
    'Content-Length': '0',
    'Content-Range': 'bytes */10',
  })
  expect(response.body).toEqual(Buffer.alloc(0))
})
