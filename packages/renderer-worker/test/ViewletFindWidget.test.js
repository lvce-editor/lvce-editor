import { beforeEach, expect, jest, test } from '@jest/globals'

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

const ViewletFindWidget = await import('../src/parts/ViewletFindWidget/ViewletFindWidget.js')
const ViewletStates = await import('../src/parts/ViewletStates/ViewletStates.js')
const Command = await import('../src/parts/Command/Command.js')

test.skip('create', () => {
  // @ts-ignore
  expect(ViewletFindWidget.create()).toBeDefined()
})

test.skip('getPosition', () => {
  // TODO compute position based on currently focused editor
  // if there is no editor, do nothing
})

test.skip('loadContent', async () => {
  // @ts-ignore
  const state = ViewletFindWidget.create()
  expect(await ViewletFindWidget.loadContent(state)).toMatchObject({
    value: '',
  })
})

test.skip('loadContent - initial value from editor selection', async () => {
  // @ts-ignore
  ViewletStates.getState.mockImplementation(() => {
    return {
      lines: ['line 1'],
      selections: new Uint32Array([0, 0, 0, 4]),
    }
  })
  // @ts-ignore
  const state = ViewletFindWidget.create()
  expect(await ViewletFindWidget.loadContent(state)).toMatchObject({
    value: 'line',
  })
})

test.skip('handleInput', () => {
  // @ts-ignore
  ViewletStates.getState.mockImplementation(() => {
    return {
      lines: [],
      selections: new Uint32Array([0, 0, 0, 4]),
    }
  })
  // @ts-ignore
  const state = ViewletFindWidget.create()
  expect(ViewletFindWidget.handleInput(state, 'abc')).toMatchObject({
    value: 'abc',
  })
})

test.skip('handleInput - adjust matchCount', () => {
  // @ts-ignore
  ViewletStates.getState.mockImplementation(() => {
    return {
      lines: ['line 1', 'line 2'],
      selections: new Uint32Array([0, 0, 0, 4]),
    }
  })
  // @ts-ignore
  const state = ViewletFindWidget.create()
  expect(ViewletFindWidget.handleInput(state, 'line 1')).toMatchObject({
    value: 'line 1',
    matchCount: 1,
  })
})

test.skip('focusPrevious', async () => {
  // @ts-ignore
  Command.execute.mockImplementation(() => {})
  // @ts-ignore
  ViewletStates.getState.mockImplementation(() => {
    return {
      lines: ['line 1', 'line 2', 'line 3'],
      selections: new Uint32Array([2, 0, 2, 4]),
    }
  })
  const state = {
    // @ts-ignore
    ...ViewletFindWidget.create(),
    matchIndex: 2,
    matchCount: 3,
    matches: new Uint32Array([0, 0, 1, 0, 2, 0]),
  }
  expect(await ViewletFindWidget.focusPrevious(state)).toMatchObject({
    matchIndex: 1,
  })
  expect(Command.execute).toHaveBeenCalledTimes(1)
  expect(Command.execute).toHaveBeenCalledWith('Editor.setSelections', new Uint32Array([1, 0, 1, 0]))
})

test.skip('focusNext', async () => {
  // @ts-ignore
  Command.execute.mockImplementation(() => {})
  // @ts-ignore
  ViewletStates.getState.mockImplementation(() => {
    return {
      lines: ['line 1', 'line 2'],
      selections: new Uint32Array([0, 0, 0, 4]),
    }
  })
  const state = {
    // @ts-ignore
    ...ViewletFindWidget.create(),
    value: 'line',
    matchIndex: 0,
    matchCount: 2,
    matches: new Uint32Array([0, 0, 1, 0]),
  }
  expect(await ViewletFindWidget.focusNext(state)).toMatchObject({
    matchIndex: 1,
    matchCount: 2,
  })
  expect(Command.execute).toHaveBeenCalledTimes(1)
  expect(Command.execute).toHaveBeenCalledWith('Editor.setSelections', new Uint32Array([1, 0, 1, 4]))
})

test.skip('focusNext - only one match', async () => {
  // @ts-ignore
  Command.execute.mockImplementation(() => {})
  // @ts-ignore
  ViewletStates.getState.mockImplementation(() => {
    return {
      lines: ['line 1'],
      selections: new Uint32Array([0, 0, 0, 4]),
    }
  })
  const state = {
    // @ts-ignore
    ...ViewletFindWidget.create(),
    value: 'line',
    matchIndex: 0,
    matchCount: 1,
    matches: new Uint32Array([0, 0]),
  }
  expect(await ViewletFindWidget.focusNext(state)).toBe(state)
  expect(Command.execute).not.toHaveBeenCalled()
})

test.skip('focusNext - at end', async () => {
  // @ts-ignore
  Command.execute.mockImplementation(() => {})
  // @ts-ignore
  ViewletStates.getState.mockImplementation(() => {
    return {
      lines: ['line 1', 'line 2'],
      selections: new Uint32Array([1, 0, 1, 4]),
    }
  })
  const state = {
    // @ts-ignore
    ...ViewletFindWidget.create(),
    value: 'line',
    matchIndex: 1,
    matchCount: 2,
    matches: new Uint32Array([0, 0, 1, 0]),
  }
  expect(await ViewletFindWidget.focusNext(state)).toMatchObject({
    matchIndex: 0,
    matchCount: 2,
  })
  expect(Command.execute).toHaveBeenCalledTimes(1)
  expect(Command.execute).toHaveBeenCalledWith('Editor.setSelections', new Uint32Array([0, 0, 0, 4]))
})
