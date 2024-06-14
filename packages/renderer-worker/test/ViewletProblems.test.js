import { beforeEach, expect, jest, test } from '@jest/globals'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/Diagnostics/Diagnostics.js', () => {
  return {
    getDiagnostics: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})

const ViewletProblems = await import('../src/parts/ViewletProblems/ViewletProblems.ipc.js')
const Diagnostics = await import('../src/parts/Diagnostics/Diagnostics.js')

test('create', () => {
  const state = ViewletProblems.create()
  expect(state).toBeDefined()
})

test('loadContent - no problems found', async () => {
  // @ts-ignore
  Diagnostics.getDiagnostics.mockImplementation(() => {
    return []
  })
  const state = ViewletProblems.create()
  expect(await ViewletProblems.loadContent(state)).toMatchObject({
    disposed: false,
    problems: [],
    focusedIndex: -2,
    message: 'No problems have been detected in the workspace.',
  })
})

test('dispose', () => {
  const state = ViewletProblems.create()
  expect(ViewletProblems.dispose(state)).toMatchObject({
    disposed: true,
  })
})

test('setFocusedIndex', () => {
  const state = ViewletProblems.create()
  expect(ViewletProblems.focusIndex(state, -1)).toMatchObject({
    focusedIndex: -1,
  })
})
