import { jest } from '@jest/globals'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/ViewletStates/ViewletStates.js', () => {
  return {
    getState: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})
jest.unstable_mockModule('../src/parts/Command/Command.js', () => {
  return {
    execute: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})

const ViewletEditorFindWidget = await import(
  '../src/parts/ViewletEditorFindWidget/ViewletEditorFindWidget.js'
)

const ViewletStates = await import(
  '../src/parts/ViewletStates/ViewletStates.js'
)
const Command = await import('../src/parts/Command/Command.js')

test('name', () => {
  expect(ViewletEditorFindWidget.name).toBe('EditorFindWidget')
})

test('create', () => {
  expect(ViewletEditorFindWidget.create()).toBeDefined()
})

test('getPosition', () => {
  // TODO compute position based on currently focused editor
  // if there is no editor, do nothing
})

test('loadContent', async () => {
  const state = ViewletEditorFindWidget.create()
  expect(await ViewletEditorFindWidget.loadContent(state)).toMatchObject({
    value: '',
  })
})

test('loadContent - initial value from editor selection', async () => {
  // @ts-ignore
  ViewletStates.getState.mockImplementation(() => {
    return {
      lines: ['line 1'],
      selections: new Uint32Array([0, 0, 0, 4]),
    }
  })
  const state = ViewletEditorFindWidget.create()
  expect(await ViewletEditorFindWidget.loadContent(state)).toMatchObject({
    value: 'line',
  })
})

test('handleInput', () => {
  // @ts-ignore
  ViewletStates.getState.mockImplementation(() => {
    return {
      lines: [],
      selections: new Uint32Array([0, 0, 0, 4]),
    }
  })
  const state = ViewletEditorFindWidget.create()
  expect(ViewletEditorFindWidget.handleInput(state, 'abc')).toMatchObject({
    value: 'abc',
  })
})

test('handleInput - adjust totalMatches', () => {
  // @ts-ignore
  ViewletStates.getState.mockImplementation(() => {
    return {
      lines: ['line 1', 'line 2'],
      selections: new Uint32Array([0, 0, 0, 4]),
    }
  })
  const state = ViewletEditorFindWidget.create()
  expect(ViewletEditorFindWidget.handleInput(state, 'line 1')).toMatchObject({
    value: 'line 1',
    totalMatches: 1,
  })
})

test('focusPrevious', async () => {
  // @ts-ignore
  Command.execute.mockImplementation(() => {})
  // @ts-ignore
  ViewletStates.getState.mockImplementation(() => {
    return {
      lines: ['line 1', 'line 2', 'line 3'],
      selections: new Uint32Array([2, 0, 2, 4]),
    }
  })
  const state = { ...ViewletEditorFindWidget.create(), matchIndex: 2 }
  expect(await ViewletEditorFindWidget.focusPrevious(state)).toMatchObject({
    matchIndex: 1,
  })
  expect(Command.execute).toHaveBeenCalledTimes(1)
  expect(Command.execute).toHaveBeenCalledWith(
    'Editor.setSelections',
    new Uint32Array([1, 0, 1, 0])
  )
})
