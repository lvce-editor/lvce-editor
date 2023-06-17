import { jest } from '@jest/globals'
import * as EditorSelection from '../src/parts/EditorSelection/EditorSelection.js'
import * as ViewletModuleId from '../src/parts/ViewletModuleId/ViewletModuleId.js'
import * as ViewletStates from '../src/parts/ViewletStates/ViewletStates.js'

beforeAll(() => {
  ViewletStates.reset()
  ViewletStates.set(ViewletModuleId.EditorText, {
    state: {
      uri: '',
      lines: [],
      selections: EditorSelection.fromRange(0, 0, 0, 0),
    },
    renderedState: {
      uri: '',
      lines: [],
      selections: EditorSelection.fromRange(0, 0, 0, 0),
    },
    factory: {},
  })
})

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/ExtensionHost/ExtensionHostReference.js', () => ({
  executeReferenceProvider: jest.fn().mockImplementation(() => {
    throw new Error('not implemented')
  }),
}))

const ExtensionHostReferences = await import('../src/parts/ExtensionHost/ExtensionHostReference.js')

const ViewletReferences = await import('../src/parts/ViewletReferences/ViewletReferences.js')

test('loadContent - error - reference provider throws error', async () => {
  const state = ViewletReferences.create()
  // @ts-ignore
  ExtensionHostReferences.executeReferenceProvider.mockImplementation(() => {
    throw new Error('Failed to execute reference provider: TypeError: x is not a function')
  })
  await expect(ViewletReferences.loadContent(state)).rejects.toThrowError(
    new Error('Failed to execute reference provider: TypeError: x is not a function')
  )
})
