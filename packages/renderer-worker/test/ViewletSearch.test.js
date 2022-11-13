import { jest } from '@jest/globals'
import * as SearchResultType from '../src/parts/SearchResultType/SearchResultType.js'
import * as MenuEntryId from '../src/parts/MenuEntryId/MenuEntryId.js'

beforeEach(() => {
  jest.resetAllMocks()
  jest.resetModules()
})

jest.unstable_mockModule('../src/parts/TextSearch/TextSearch.js', () => {
  return {
    textSearch: jest.fn(() => {
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

const ViewletSearch = await import(
  '../src/parts/ViewletSearch/ViewletSearch.js'
)

const TextSearch = await import('../src/parts/TextSearch/TextSearch.js')
const Command = await import('../src/parts/Command/Command.js')

test('create', () => {
  const state = ViewletSearch.create()
  expect(state).toBeDefined()
})

test.skip('dispose', () => {
  const state = ViewletSearch.create()
  // TODO should test that remaining searches are canceled
  ViewletSearch.dispose(state)
  expect(state).toEqual({
    results: [],
    searchId: -1,
    state: 'default',
    stats: {},
    value: '',
  })
})

test('loadContent - restore value', async () => {
  const state = ViewletSearch.create()
  // @ts-ignore
  TextSearch.textSearch.mockImplementation(() => {
    return []
  })
  expect(
    await ViewletSearch.loadContent(state, {
      value: 'test search',
    })
  ).toMatchObject({
    value: 'test search',
  })
})

test('setValue - error - preview is not of type array', async () => {
  const state = ViewletSearch.create()
  // @ts-ignore
  TextSearch.textSearch.mockImplementation(() => {
    return [
      [
        './file-1.txt',
        {
          preview: 'abc',
          absoluteOffset: 0,
        },
      ],
    ]
  })
  expect(await ViewletSearch.setValue(state, 'abc')).toMatchObject({
    message: 'Error: previews must be of type array',
  })
})

test('setValue - one match in one file', async () => {
  const state = ViewletSearch.create()
  // @ts-ignore
  TextSearch.textSearch.mockImplementation(() => {
    return [
      [
        './file-1.txt',
        [
          {
            preview: 'abc',
            absoluteOffset: 0,
          },
        ],
      ],
    ]
  })
  expect(await ViewletSearch.setValue(state, 'abc')).toMatchObject({
    value: 'abc',
    items: [
      {
        icon: '',
        text: 'file-1.txt',
        title: '/file-1.txt',
        type: 'file',
      },
      {
        icon: '',
        text: 'abc',
        title: 'abc',
        type: 'preview',
      },
    ],
    message: 'Found 1 result in 1 file',
  })
})

test('setValue - two matches in one file', async () => {
  const state = ViewletSearch.create()
  // @ts-ignore
  TextSearch.textSearch.mockImplementation(() => {
    return [
      [
        './file-1.txt',
        [
          {
            preview: 'abc',
            absoluteOffset: 0,
          },
          {
            preview: 'abc',
            absoluteOffset: 1,
          },
        ],
      ],
    ]
  })
  expect(await ViewletSearch.setValue(state, 'abc')).toMatchObject({
    value: 'abc',
    items: [
      {
        icon: '',
        text: 'file-1.txt',
        title: '/file-1.txt',
        type: 'file',
      },
      {
        icon: '',
        text: 'abc',
        title: 'abc',
        type: 'preview',
      },
      {
        icon: '',
        text: 'abc',
        title: 'abc',
        type: 'preview',
      },
    ],
    message: 'Found 2 results in 1 file',
  })
})

test('setValue - two matches in two files', async () => {
  const state = ViewletSearch.create()
  // @ts-ignore
  TextSearch.textSearch.mockImplementation(() => {
    return [
      [
        './file-1.txt',
        [
          {
            preview: 'abc',
            absoluteOffset: 0,
          },
        ],
      ],
      [
        './file-2.txt',
        [
          {
            preview: 'abc',
            absoluteOffset: 0,
          },
        ],
      ],
    ]
  })
  expect(await ViewletSearch.setValue(state, 'abc')).toMatchObject({
    value: 'abc',
    items: [
      {
        icon: '',
        text: 'file-1.txt',
        title: '/file-1.txt',
        type: 'file',
      },
      {
        icon: '',
        text: 'abc',
        title: 'abc',
        type: 'preview',
      },
      {
        icon: '',
        text: 'file-2.txt',
        title: '/file-2.txt',
        type: 'file',
      },
      {
        icon: '',
        text: 'abc',
        title: 'abc',
        type: 'preview',
      },
    ],
    message: 'Found 2 results in 2 files',
  })
})

test('handleInput - empty results', async () => {
  const state = ViewletSearch.create()
  // @ts-ignore
  TextSearch.textSearch.mockImplementation(() => {
    return []
  })
  expect(await ViewletSearch.handleInput(state, 'test search')).toMatchObject({
    value: 'test search',
  })
})

test('handleInput - empty value', async () => {
  const state = ViewletSearch.create()
  // @ts-ignore
  TextSearch.textSearch.mockImplementation(() => {
    return []
  })
  expect(await ViewletSearch.handleInput(state, '')).toMatchObject({
    value: '',
    items: [],
  })
  expect(TextSearch.textSearch).not.toHaveBeenCalled()
})

test('handleInput - error', async () => {
  // @ts-ignore
  TextSearch.textSearch.mockImplementation(() => {
    throw new Error('could not load search results')
  })
  const state = ViewletSearch.create()
  expect(await ViewletSearch.handleInput(state, 'test search')).toMatchObject({
    message: `Error: could not load search results`,
  })
})

test('handleClick', async () => {
  const state = {
    ...ViewletSearch.create(),
    items: [
      {
        type: SearchResultType.File,
        text: './test.txt',
        title: '/test/test.txt',
      },
    ],
  }
  // @ts-ignore
  Command.execute.mockImplementation(() => {})
  expect(await ViewletSearch.handleClick(state, 0)).toBe(state)
  expect(Command.execute).toHaveBeenCalledTimes(1)
  expect(Command.execute).toHaveBeenCalledWith('Main.openUri', '/test/test.txt')
})

test('resize', () => {
  const state = ViewletSearch.create()
  const newState = ViewletSearch.resize(state, {
    top: 200,
    left: 200,
    width: 200,
    height: 200,
  })
  // TODO
  expect(newState).toMatchObject({
    disposed: false,
    height: 200,
    left: 200,
    searchId: -1,
    searchResults: [],
    stats: {},
    top: 200,
    value: '',
    width: 200,
    fileCount: 0,
  })
})

test('handleContextMenuMouseAt', async () => {
  // @ts-ignore
  Command.execute.mockImplementation(() => {})
  const state = { ...ViewletSearch.create(), top: 0, left: 0 }
  expect(await ViewletSearch.handleContextMenuMouseAt(state, 10, 10)).toBe(
    state
  )
  expect(Command.execute).toHaveBeenCalledTimes(1)
  expect(Command.execute).toHaveBeenCalledWith(
    'ContextMenu.show',
    10,
    10,
    MenuEntryId.Search
  )
})

test('handleContextMenuKeyBoard', async () => {
  // @ts-ignore
  Command.execute.mockImplementation(() => {})
  const state = { ...ViewletSearch.create(), top: 0, left: 0 }
  expect(await ViewletSearch.handleContextMenuKeyboard(state)).toBe(state)
  expect(Command.execute).toHaveBeenCalledTimes(1)
  expect(Command.execute).toHaveBeenCalledWith(
    'ContextMenu.show',
    0,
    0,
    MenuEntryId.Search
  )
})

test('selectIndex - negative index', async () => {
  const state = {
    ...ViewletSearch.create(),
  }
  expect(await ViewletSearch.selectIndex(state, -1)).toBe(state)
})
