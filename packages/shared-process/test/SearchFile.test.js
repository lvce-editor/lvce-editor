import { mkdtemp } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { dirname, join, sep } from 'node:path'
import { fileURLToPath } from 'node:url'
import { mkdir, writeFile } from '../src/parts/FileSystem/FileSystem.js'
import { searchFile } from '../src/parts/SearchFile/SearchFile.js'

const __dirname = dirname(fileURLToPath(import.meta.url))

const getTmpDir = () => {
  return mkdtemp(join(tmpdir(), 'foo-'))
}

const fixPath = (path) => {
  return path.replaceAll('/', sep)
}

let tmpDir

beforeAll(async () => {
  tmpDir = await getTmpDir()
  await writeFile(join(tmpDir, 'fileA'), '')
  await writeFile(join(tmpDir, 'fileB'), '')
  await mkdir(join(tmpDir, 'nested'))
  await writeFile(join(tmpDir, 'nested', 'fileC'), '')
})

test('searchFile - exact match', async () => {
  expect(await searchFile(tmpDir, 'fileA')).toEqual([
    fixPath('fileA'),
    fixPath('fileB'),
    fixPath('nested/fileC'),
  ])
})

test('searchFile - match filename in nested folder', async () => {
  expect(await searchFile(tmpDir, 'fileC')).toEqual([
    fixPath('fileA'),
    fixPath('fileB'),
    fixPath('nested/fileC'),
  ])
})

test('searchFile - match files that start with searchTerm', async () => {
  expect(await searchFile(tmpDir, 'file')).toEqual([
    fixPath('fileA'),
    fixPath('fileB'),
    fixPath('nested/fileC'),
  ])
})

test('searchFile - match files that contain searchTerm', async () => {
  expect(await searchFile(tmpDir, 'ile')).toEqual([
    fixPath('fileA'),
    fixPath('fileB'),
    fixPath('nested/fileC'),
  ])
})

test('searchFile - match files that end with searchTerm', async () => {
  expect(await searchFile(tmpDir, 'eA')).toEqual([
    fixPath('fileA'),
    fixPath('fileB'),
    fixPath('nested/fileC'),
  ])
})

test('searchFile - no matching files', async () => {
  expect(
    await searchFile(`${__dirname}/fixture-search-file-1`, 'non-existing')
  ).toEqual([fixPath('fileA'), fixPath('fileB'), fixPath('nested/fileC')])
})

test('searchFile - empty string', async () => {
  expect(await searchFile(`${__dirname}/fixture-search-file-1`, '')).toEqual([
    fixPath('fileA'),
    fixPath('fileB'),
    fixPath('nested/fileC'),
  ])
})
