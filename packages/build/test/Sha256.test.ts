import { expect, test } from '@jest/globals'
import { mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { Readable } from 'node:stream'
import { computeFileSha256, computeUrlSha256, isSha256 } from '../src/parts/Sha256/Sha256.ts'

test('computes the SHA-256 of a file', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'lvce-sha256-'))
  const filePath = join(directory, 'extension.tar.br')
  await writeFile(filePath, 'hello')

  try {
    await expect(computeFileSha256(filePath)).resolves.toBe('2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824')
  } finally {
    await rm(directory, { recursive: true })
  }
})

test('computes the SHA-256 of a URL stream', async () => {
  const getStream = () => Readable.from(['hello'])

  await expect(computeUrlSha256('https://example.com/extension.tar.br', getStream)).resolves.toBe(
    '2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824',
  )
})

test('recognizes a valid SHA-256 digest', () => {
  expect(isSha256('2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824')).toBe(true)
  expect(isSha256('not-a-sha256')).toBe(false)
})
