import { jest } from '@jest/globals'
import * as Viewlet from '../src/parts/Viewlet/Viewlet.js'

beforeAll(() => {
  Viewlet.state.instances = Object.create(null)
  Viewlet.state.instances['EditorText'] = {
    state: {
      uri: '',
      lines: [],
      cursor: {
        rowIndex: 0,
        columnIndex: 0,
      },
    },
  }
})

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule(
  '../src/parts/ExtensionHost/ExtensionHostReference.js',
  () => ({
    executeReferenceProvider: jest.fn().mockImplementation(() => {
      throw new Error('not implemented')
    }),
  })
)

const ExtensionHostReferences = await import(
  '../src/parts/ExtensionHost/ExtensionHostReference.js'
)

const ViewletReferences = await import(
  '../src/parts/Viewlet/ViewletReferences.js'
)

test('name', () => {
  expect(ViewletReferences.name).toBe('References')
})

test('loadContent - error - reference provider throws error', async () => {
  const state = ViewletReferences.create()
  // @ts-ignore
  ExtensionHostReferences.executeReferenceProvider.mockImplementation(() => {
    throw new Error(
      'Failed to execute reference provider: TypeError: x is not a function'
    )
  })
  await expect(ViewletReferences.loadContent(state)).rejects.toThrowError(
    new Error(
      'Failed to execute reference provider: TypeError: x is not a function'
    )
  )
})
