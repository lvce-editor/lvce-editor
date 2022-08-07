import { jest } from '@jest/globals'
import * as EditorSelection from '../src/parts/EditorSelection/EditorSelection.js'
import * as ViewletStates from '../src/parts/ViewletStates/ViewletStates.js'

beforeAll(() => {
  ViewletStates.reset()
  ViewletStates.set('EditorText', {
    state: {
      uri: '',
      lines: [],
      selections: EditorSelection.fromRange(0, 0, 0, 0),
    },
  })
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
  '../src/parts/ViewletImplementations/ViewletImplementations.js'
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
