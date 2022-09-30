import { jest } from '@jest/globals'
import * as ExtensionManifestInputType from '../src/parts/ExtensionManifestInputType/ExtensionManifestInputType.js'

afterEach(() => {
  jest.resetModules()
})

jest.unstable_mockModule(
  '../src/parts/ExtensionManifests/ExtensionManifestsFromFolder.js',
  () => ({
    getExtensionManifests: jest.fn(() => {
      throw new Error('not implemented')
    }),
  })
)

const ExtensionManifests = await import(
  '../src/parts/ExtensionManifests/ExtensionManifests.js'
)
const ExtensionManifestsFromFolder = await import(
  '../src/parts/ExtensionManifests/ExtensionManifestsFromFolder.js'
)

test('getAll', async () => {
  // @ts-ignore
  ExtensionManifestsFromFolder.getExtensionManifests.mockImplementation(() => {
    return [
      {
        path: '/test/built-in-extensions/extension-1',
        name: 'extension-1',
      },
    ]
  })
  expect(
    await ExtensionManifests.getAll([
      {
        type: ExtensionManifestInputType.Folder,
        path: '/test/built-in-extensions',
      },
    ])
  ).toEqual([
    {
      path: '/test/built-in-extensions/extension-1',
      name: 'extension-1',
    },
  ])
  expect(
    ExtensionManifestsFromFolder.getExtensionManifests
  ).toHaveBeenCalledTimes(1)
  expect(
    ExtensionManifestsFromFolder.getExtensionManifests
  ).toHaveBeenCalledWith('/test/built-in-extensions')
})
