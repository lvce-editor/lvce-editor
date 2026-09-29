import { beforeEach, expect, jest, test } from '@jest/globals'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/Debug/Debug.js', () => {
  return {
    start: jest.fn(() => {}),
    listProcesses: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})

const ViewletRunAndDebug = await import('../src/parts/ViewletRunAndDebug/ViewletRunAndDebug.js')
const Debug = await import('../src/parts/Debug/Debug.js')

test.skip('create', () => {
  const state = ViewletRunAndDebug.create(0)
  expect(state).toBeDefined()
})

test.skip('loadContent', async () => {
  // @ts-ignore
  Debug.listProcesses.mockImplementation(() => {
    return []
  })
  const state = ViewletRunAndDebug.create(0)
  expect(await ViewletRunAndDebug.loadContent(state)).toMatchObject({
    disposed: false,
    id: 0,
  })
})

test.skip('dispose', () => {
  const state = ViewletRunAndDebug.create(0)
  expect(ViewletRunAndDebug.dispose(state)).toMatchObject({
    disposed: true,
  })
})

test.skip('resize', () => {
  const state = ViewletRunAndDebug.create()
  const newState = ViewletRunAndDebug.resize(state, {
    x: 200,
    y: 200,
    width: 200,
    height: 200,
  })
  // TODO
  expect(newState).toMatchObject({
    disposed: false,
    height: 200,
    id: undefined,
    x: 200,
    y: 200,
    width: 200,
  })
})
