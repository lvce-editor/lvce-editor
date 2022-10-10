import { jest } from '@jest/globals'
import * as DirentType from '../src/parts/DirentType/DirentType.js'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/Command/Command.js', () => {
  return {
    execute: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})

const Command = await import('../src/parts/Command/Command.js')

const FileSystemFetch = await import(
  '../src/parts/FileSystem/FileSystemFetch.js'
)

test('readDirWithFileTypes', async () => {
  // @ts-ignore
  Command.execute.mockImplementation(() => {
    return ['/playground/index.css', '/playground/index.html']
  })
  expect(await FileSystemFetch.readDirWithFileTypes('')).toEqual([
    {
      type: DirentType.Directory,
      name: 'playground',
    },
  ])
})

test('readDirWithFileTypes - sub directory', async () => {
  // @ts-ignore
  Command.execute.mockImplementation(() => {
    return ['/playground/index.css', '/playground/index.html']
  })
  expect(await FileSystemFetch.readDirWithFileTypes('/playground')).toEqual([
    {
      type: DirentType.File,
      name: 'index.css',
    },
    {
      type: DirentType.File,
      name: 'index.html',
    },
  ])
})
