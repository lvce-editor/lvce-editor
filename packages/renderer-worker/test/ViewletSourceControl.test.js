import { jest, beforeAll, afterAll, test, expect, beforeEach, afterEach } from '@jest/globals'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/ExtensionHost/ExtensionHostSourceControl.js', () => {
  return {
    acceptInput: jest.fn(() => {
      throw new Error('not implemented')
    }),
    getChangedFiles: jest.fn(() => {
      throw new Error('not implemented')
    }),
    getFileBefore: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})

const ViewletSourceControl = await import('../src/parts/ViewletSourceControl/ViewletSourceControl.ipc.js')
const ViewletManager = await import('../src/parts/ViewletManager/ViewletManager.js')

test('create', () => {
  const state = ViewletSourceControl.create()
  expect(state).toBeDefined()
})

test.skip('loadContent', async () => {
  const state = ViewletSourceControl.create()
  expect(await ViewletSourceControl.loadContent(state)).toEqual({
    disposed: false,
    src: 'abc',
  })
})

test.skip('contentLoaded', async () => {
  const state = { ...ViewletSourceControl.create() }
  // @ts-ignore
  await ViewletSourceControl.contentLoaded(state)
})

test('dispose', () => {
  const state = ViewletSourceControl.create()
  expect(ViewletSourceControl.dispose(state)).toMatchObject({
    disposed: true,
  })
})

test('resize', () => {
  const state = ViewletSourceControl.create()
  const newState = ViewletSourceControl.resize(state, {
    x: 200,
    y: 200,
    width: 200,
    height: 200,
  })
  // TODO
  expect(newState).toMatchObject({
    disposed: false,
    height: 200,
    index: [],
    x: 200,
    y: 200,
    merge: [],
    untracked: [],
    width: 200,
    workingTree: [],
  })
})

test('handleMouseOver', async () => {
  const state = { ...ViewletSourceControl.create(), displayItems: [] }
  expect(await ViewletSourceControl.handleMouseOver(state, 0)).toBe(state)
})
