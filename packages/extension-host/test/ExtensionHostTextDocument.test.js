import { jest } from '@jest/globals'
import * as SharedProcess from '../src/parts/SharedProcess/SharedProcess.js'
import * as TextDocument from '../src/parts/ExtensionHostTextDocument/ExtensionHostTextDocument.js'

afterEach(() => {
  jest.resetAllMocks()
})

test('syncFull', () => {
  TextDocument.syncFull('/tmp/some-file.txt', 1, 'unknown', 'sample text')
  expect(TextDocument.state.textDocuments[1]).toEqual({
    documentId: 1,
    languageId: 'unknown',
    text: 'sample text',
    uri: '/tmp/some-file.txt',
  })
})

test('syncFull - listener throws error', () => {
  const spy = jest.spyOn(console, 'error')
  const handleOpenEditor = jest.fn(() => {
    throw new Error('x is not a function')
  })
  TextDocument.onDidOpenTextDocument(handleOpenEditor)
  TextDocument.syncFull('/tmp/some-file.txt', 1, 'unknown', 'sample text')
  expect(spy).toHaveBeenCalledWith(
    new Error('Failed to run open listener: x is not a function')
  )
})

test('syncFull - async listener throws error', async () => {
  const spy = jest.spyOn(console, 'error')
  const handleOpenEditor = jest.fn(async () => {
    throw new Error('x is not a function')
  })
  TextDocument.onDidOpenTextDocument(handleOpenEditor)
  TextDocument.syncFull('/tmp/some-file.txt', 1, 'unknown', 'sample text')
  await Promise.resolve()
  expect(spy).toHaveBeenCalledWith(
    new Error('Failed to run open listener: x is not a function')
  )
})

// TODO test multiple changes

test('syncIncremental - single change at start', () => {
  TextDocument.syncFull('/tmp/some-file.txt', 1, 'unknown', 'line 1\nline 2')
  TextDocument.syncIncremental(1, [
    {
      start: {
        rowIndex: 0,
        columnIndex: 0,
      },
      end: {
        rowIndex: 0,
        columnIndex: 0,
      },
      inserted: ['more '],
      deleted: [''],
    },
  ])
  expect(TextDocument.state.textDocuments[1]).toEqual({
    documentId: 1,
    languageId: 'unknown',
    text: 'more line 1\nline 2',
    uri: '/tmp/some-file.txt',
  })
})

test('syncIncremental - single change at end', () => {
  TextDocument.syncFull('/tmp/some-file.txt', 1, 'unknown', 'line 1\nline 2')
  TextDocument.syncIncremental(1, [
    {
      start: {
        rowIndex: 1,
        columnIndex: 6,
      },
      end: {
        rowIndex: 1,
        columnIndex: 6,
      },
      inserted: [' more'],
      deleted: [''],
    },
  ])
  expect(TextDocument.state.textDocuments[1]).toEqual({
    documentId: 1,
    languageId: 'unknown',
    text: 'line 1\nline 2 more',
    uri: '/tmp/some-file.txt',
  })
})

test('applyEdit', () => {
  TextDocument.syncFull('/tmp/some-file.txt', 1, 'unknown', 'line 1\nline 2')
  const textDocument = TextDocument.get(1)
  SharedProcess.state.ipc = { send: jest.fn() }
  TextDocument.applyEdit(textDocument, {
    offset: 8,
    inserted: 'a',
    deleted: 0,
  })
  expect(SharedProcess.state.ipc.send).toHaveBeenCalledTimes(1)
  expect(SharedProcess.state.ipc.send).toHaveBeenCalledWith({
    id: expect.any(Number),
    jsonrpc: '2.0',
    method: 991,
    params: [
      [
        {
          start: {
            rowIndex: 1,
            columnIndex: 1,
          },
          end: {
            rowIndex: 1,
            columnIndex: 1,
          },
          inserted: ['a'],
          deleted: [],
        },
      ],
    ],
  })
})

test('getOffset - at start', () => {
  expect(
    TextDocument.getOffset(
      {
        text: `line1
  line 2
  `,
      },
      { rowIndex: 0, columnIndex: 0 }
    )
  ).toBe(0)
})

test('getOffset - in middle', () => {
  expect(
    TextDocument.getOffset(
      {
        text: `line1

  line 2
  line 3`,
      },
      { rowIndex: 2, columnIndex: 3 }
    )
  ).toBe(10)
})

test('getPosition - at start', () => {
  expect(
    TextDocument.getPosition(
      {
        text: `line1
line 2
`,
      },
      0
    )
  ).toEqual({
    rowIndex: 0,
    columnIndex: 0,
  })
})

test('getPosition - middle of first line', () => {
  expect(
    TextDocument.getPosition(
      {
        text: `line 1
line 2
`,
      },
      4
    )
  ).toEqual({
    rowIndex: 0,
    columnIndex: 4,
  })
})

test('getPosition - in middle', () => {
  expect(
    TextDocument.getPosition(
      {
        text: `line1

line 2
line 3`,
      },
      10
    )
  ).toEqual({
    rowIndex: 2,
    columnIndex: 3,
  })
})

test('getPosition - bug', () => {
  expect(
    TextDocument.getPosition(
      {
        text: `const a = 1
console.log('hello world')
a
const x = 'log'

const y = {
  log() {},
}

const z = y
alert(1)`,
      },
      40
    )
  ).toEqual({
    rowIndex: 2,
    columnIndex: 1,
  })
})

test('getPosition - another bug', () => {
  expect(
    TextDocument.getPosition(
      {
        text: `const a = 1
console.log('hello world')
aaaaa
const x = 'log'

const y = {
  log() {},
}

const z = y
alert(1)`,
      },
      44
    )
  ).toEqual({
    rowIndex: 2,
    columnIndex: 5,
  })
})
