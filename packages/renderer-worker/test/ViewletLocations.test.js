import { jest } from '@jest/globals'

jest.unstable_mockModule('../src/parts/Command/Command.js', () => ({
  execute: jest.fn(() => {
    throw new Error('not implemented')
  }),
}))

const ViewletMain = await import('../src/parts/ViewletMain/ViewletMain.js')
const Command = await import('../src/parts/Command/Command.js')

const ViewletStates = await import(
  '../src/parts/ViewletStates/ViewletStates.js'
)

beforeAll(() => {
  ViewletStates.reset()
  ViewletStates.set('EditorText', {
    state: {
      uri: '',
      lines: [],
      cursor: {
        rowIndex: 0,
        columnIndex: 0,
      },
    },
    factory: {},
  })
  ViewletStates.set('Main', {
    state: {},
    factory: {},
  })
})

beforeEach(() => {
  jest.resetAllMocks()
})

const ViewletLocations = await import(
  '../src/parts/ViewletLocations/ViewletLocations.js'
)


test('create', () => {
  const state = ViewletLocations.create()
  expect(state).toBeDefined()
})

test('loadContent - error - location provider throws error', async () => {
  const state = ViewletLocations.create()
  const provideLocations = () => {
    throw new Error(
      'Failed to execute reference provider: TypeError: x is not a function'
    )
  }
  await expect(
    ViewletLocations.loadContent(state, provideLocations)
  ).rejects.toThrowError(
    new Error(
      'Failed to execute reference provider: TypeError: x is not a function'
    )
  )
})

test('loadContent - no locations found', async () => {
  const state = ViewletLocations.create()
  const provideLocations = () => {
    return []
  }
  expect(
    await ViewletLocations.loadContent(state, provideLocations)
  ).toMatchObject({
    references: [],
  })
})

test('loadContent - one result in one file', async () => {
  const state = ViewletLocations.create()
  const provideLocations = () => {
    return [
      {
        uri: '/test/index.js',
        lineText: 'test',
        startOffset: 0,
        endOffset: 0,
      },
    ]
  }
  expect(
    await ViewletLocations.loadContent(state, provideLocations)
  ).toMatchObject({
    displayReferences: [
      {
        depth: 1,
        posInSet: 1,
        setSize: 1,
        type: 'expanded',
        uri: '/test/index.js',
        name: 'index.js',
        lineText: '',
      },
      {
        depth: 2,
        posInSet: 1,
        setSize: 1,
        type: 'leaf',
        name: '',
        uri: '',
        lineText: 'test',
      },
    ],
    message: '1 result in 1 file',
  })
})

test('loadContent - multiple results in one file', async () => {
  const state = ViewletLocations.create()
  const provideLocations = () => {
    return [
      {
        uri: '/test/index.js',
        lineText: 'test-1',
        startOffset: 0,
        endOffset: 0,
      },
      {
        uri: '/test/index.js',
        lineText: 'test-2',
        startOffset: 1,
        endOffset: 1,
      },
    ]
  }
  expect(
    await ViewletLocations.loadContent(state, provideLocations)
  ).toMatchObject({
    displayReferences: [
      {
        depth: 1,
        posInSet: 1,
        setSize: 1,
        type: 'expanded',
        uri: '/test/index.js',
        name: 'index.js',
        lineText: '',
      },
      {
        depth: 2,
        posInSet: 1,
        setSize: 1, // TODO should be 2
        type: 'leaf',
        name: '',
        uri: '',
        lineText: 'test-1',
      },
      {
        depth: 2,
        posInSet: 2,
        setSize: 1, // TODO should be 2
        type: 'leaf',
        name: '',
        uri: '',
        lineText: 'test-2',
      },
    ],
    message: '2 results in 1 file',
  })
})

test('loadContent - multiple results in multiple file', async () => {
  const state = ViewletLocations.create()
  const provideLocations = () => {
    return [
      {
        uri: '/test/a.js',
        lineText: '',
        startOffset: 0,
        endOffset: 0,
      },
      {
        uri: '/test/a.js',
        lineText: '',
        startOffset: 1,
        endOffset: 1,
      },
      {
        uri: '/test/b.js',
        lineText: '',
        startOffset: 0,
        endOffset: 0,
      },
      {
        uri: '/test/b.js',
        lineText: '',
        startOffset: 1,
        endOffset: 1,
      },
    ]
  }
  expect(
    await ViewletLocations.loadContent(state, provideLocations)
  ).toMatchObject({
    displayReferences: [
      {
        depth: 1,
        lineText: '',
        name: 'a.js',
        posInSet: 1,
        setSize: 1, // TODO should be 2
        type: 'expanded',
        uri: '/test/a.js',
      },
      {
        depth: 2,
        lineText: '',
        name: '',
        posInSet: 1,
        setSize: 1, // TODO should be 2
        type: 'leaf',
        uri: '',
      },
      {
        depth: 2,
        lineText: '',
        name: '',
        posInSet: 2,
        setSize: 1, // TODO should be 2
        type: 'leaf',
        uri: '',
      },
      {
        depth: 1,
        lineText: '',
        name: 'b.js',
        posInSet: 2,
        setSize: 1, // TODO should be 2
        type: 'expanded',
        uri: '/test/b.js',
      },
      {
        depth: 2,
        lineText: '',
        name: '',
        posInSet: 1,
        setSize: 1, // TODO should be 2
        type: 'leaf',
        uri: '',
      },
      {
        depth: 2,
        lineText: '',
        name: '',
        posInSet: 2,
        setSize: 1, // TODO should be 2
        type: 'leaf',
        uri: '',
      },
    ],
    message: '4 results in 2 files',
  })
})

test('selectIndex - reference', async () => {
  const state = {
    ...ViewletLocations.create(),
    displayReferences: [
      {
        depth: 1,
        posInSet: 1,
        setSize: 1,
        type: 'expanded',
        uri: '/test/index.js',
        name: 'index.js',
        lineText: '',
      },
      {
        depth: 2,
        posInSet: 1,
        setSize: 1,
        type: 'leaf',
        name: '',
        uri: '',
        lineText: 'test',
      },
    ],
    message: '1 result in 1 file',
  }
  // @ts-ignore
  Command.execute.mockImplementation(() => {})
  await ViewletLocations.selectIndex(state, 1)
  expect(Command.execute).toHaveBeenCalledTimes(1)
  expect(Command.execute).toHaveBeenCalledWith('Main.openUri', '/test/index.js')
})

test('focusFirst', () => {
  const state = {
    ...ViewletLocations.create(),
    displayReferences: [
      {
        depth: 1,
        posInSet: 1,
        setSize: 1,
        type: 'expanded',
        uri: '/test/index.js',
        name: 'index.js',
        lineText: '',
      },
      {
        depth: 2,
        posInSet: 1,
        setSize: 1,
        type: 'leaf',
        name: '',
        uri: '',
        lineText: 'test',
      },
    ],
    focusedIndex: 1,
  }
  expect(ViewletLocations.focusFirst(state)).toMatchObject({
    focusedIndex: 0,
  })
})

test('focusFirst - no references', () => {
  const state = {
    ...ViewletLocations.create(),
    displayReferences: [],
  }
  expect(ViewletLocations.focusFirst(state)).toBe(state)
})

test('focusLast', () => {
  const state = {
    ...ViewletLocations.create(),
    displayReferences: [
      {
        depth: 1,
        posInSet: 1,
        setSize: 1,
        type: 'expanded',
        uri: '/test/index.js',
        name: 'index.js',
        lineText: '',
      },
      {
        depth: 2,
        posInSet: 1,
        setSize: 1,
        type: 'leaf',
        name: '',
        uri: '',
        lineText: 'test',
      },
    ],
    focusedIndex: 0,
  }
  expect(ViewletLocations.focusLast(state)).toMatchObject({
    focusedIndex: 1,
  })
})

test('focusLast - no references', () => {
  const state = {
    ...ViewletLocations.create(),
    displayReferences: [],
  }
  expect(ViewletLocations.focusLast(state)).toBe(state)
})

test('focusNext', () => {
  const state = {
    ...ViewletLocations.create(),
    displayReferences: [
      {
        depth: 1,
        posInSet: 1,
        setSize: 1,
        type: 'expanded',
        uri: '/test/index.js',
        name: 'index.js',
        lineText: '',
      },
      {
        depth: 2,
        posInSet: 1,
        setSize: 1,
        type: 'leaf',
        name: '',
        uri: '',
        lineText: 'test',
      },
    ],
    focusedIndex: 0,
  }
  expect(ViewletLocations.focusNext(state)).toMatchObject({
    focusedIndex: 1,
  })
})

test('focusNext - already at end', () => {
  const state = {
    ...ViewletLocations.create(),
    displayReferences: [
      {
        depth: 1,
        posInSet: 1,
        setSize: 1,
        type: 'expanded',
        uri: '/test/index.js',
        name: 'index.js',
        lineText: '',
      },
      {
        depth: 2,
        posInSet: 1,
        setSize: 1,
        type: 'leaf',
        name: '',
        uri: '',
        lineText: 'test',
      },
    ],
    focusedIndex: 1,
  }
  expect(ViewletLocations.focusNext(state)).toBe(state)
})

test('focusPrevious', () => {
  const state = {
    ...ViewletLocations.create(),
    displayReferences: [
      {
        depth: 1,
        posInSet: 1,
        setSize: 1,
        type: 'expanded',
        uri: '/test/index.js',
        name: 'index.js',
        lineText: '',
      },
      {
        depth: 2,
        posInSet: 1,
        setSize: 1,
        type: 'leaf',
        name: '',
        uri: '',
        lineText: 'test',
      },
    ],
    focusedIndex: 1,
  }
  expect(ViewletLocations.focusPrevious(state)).toMatchObject({
    focusedIndex: 0,
  })
})

test('focusPrevious - already at start', () => {
  const state = {
    ...ViewletLocations.create(),
    displayReferences: [
      {
        depth: 1,
        posInSet: 1,
        setSize: 1,
        type: 'expanded',
        uri: '/test/index.js',
        name: 'index.js',
        lineText: '',
      },
      {
        depth: 2,
        posInSet: 1,
        setSize: 1,
        type: 'leaf',
        name: '',
        uri: '',
        lineText: 'test',
      },
    ],
    focusedIndex: 0,
  }
  expect(ViewletLocations.focusPrevious(state)).toBe(state)
})

test('selectCurrent - no item focused', () => {
  const state = {
    ...ViewletLocations.create(),
    displayReferences: [
      {
        depth: 1,
        posInSet: 1,
        setSize: 1,
        type: 'expanded',
        uri: '/test/index.js',
        name: 'index.js',
        lineText: '',
      },
      {
        depth: 2,
        posInSet: 1,
        setSize: 1,
        type: 'leaf',
        name: '',
        uri: '',
        lineText: 'test',
      },
    ],
    focusedIndex: -1,
  }
  // @ts-ignore
  Command.execute.mockImplementation(() => {})
  expect(ViewletLocations.selectCurrent(state)).toBe(state)
  expect(Command.execute).not.toHaveBeenCalled()
})
