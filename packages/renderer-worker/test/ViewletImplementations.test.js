import { jest } from '@jest/globals'
import * as Viewlet from '../src/parts/Viewlet/Viewlet.js'

beforeAll(() => {
  Viewlet.state.instances = Object.create(null)
  Viewlet.state.instances.EditorText = {
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
  '../src/parts/ExtensionHost/ExtensionHostImplementation.js',
  () => ({
    executeImplementationProvider: jest.fn().mockImplementation(() => {
      throw new Error('not implemented')
    }),
  })
)

const ExtensionHostImplementations = await import(
  '../src/parts/ExtensionHost/ExtensionHostImplementation.js'
)

const ViewletImplementations = await import(
  '../src/parts/Viewlet/ViewletImplementations.js'
)

test('name', () => {
  expect(ViewletImplementations.name).toBe('Implementations')
})

test('loadContent - error - reference provider throws error', async () => {
  const state = ViewletImplementations.create()
  // @ts-ignore
  ExtensionHostImplementations.executeImplementationProvider.mockImplementation(
    () => {
      throw new Error(
        'Failed to execute reference provider: TypeError: x is not a function'
      )
    }
  )
  await expect(ViewletImplementations.loadContent(state)).rejects.toThrowError(
    new Error(
      'Failed to execute reference provider: TypeError: x is not a function'
    )
  )
})
