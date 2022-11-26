import { jest } from '@jest/globals'
import * as ViewletModuleId from '../src/parts/ViewletModuleId/ViewletModuleId.js'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule(
  '../src/parts/ExtensionHost/ExtensionHostSourceControl.js',
  () => {
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
  }
)

const ViewletSourceControl = await import(
  '../src/parts/ViewletSourceControl/ViewletSourceControl.js'
)

const ExtensionHostSourceControl = await import(
  '../src/parts/ExtensionHost/ExtensionHostSourceControl.js'
)

const ViewletManager = await import(
  '../src/parts/ViewletManager/ViewletManager.js'
)

const render = (oldState, newState) => {
  return ViewletManager.render(
    ViewletSourceControl,
    oldState,
    newState,
    ViewletModuleId.SourceControl
  )
}

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
    top: 200,
    left: 200,
    width: 200,
    height: 200,
  })
  // TODO
  expect(newState).toMatchObject({
    disposed: false,
    height: 200,
    index: [],
    left: 200,
    merge: [],
    top: 200,
    untracked: [],
    width: 200,
    workingTree: [],
  })
})

test('acceptInput', async () => {
  // @ts-ignore
  ExtensionHostSourceControl.acceptInput.mockImplementation(() => {})
  const state = ViewletSourceControl.create()
  expect(await ViewletSourceControl.acceptInput(state, 'abc')).toMatchObject({
    inputValue: '',
  })
})

test('render - inputValue changed', () => {
  const oldState = ViewletSourceControl.create()
  const newState = {
    ...oldState,
    inputValue: 'abc',
  }
  expect(render(oldState, newState)).toEqual([
    ['Viewlet.send', 'Source Control', 'setInputValue', 'abc'],
  ])
})
