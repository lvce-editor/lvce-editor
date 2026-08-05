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
