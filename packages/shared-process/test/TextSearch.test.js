import { jest } from '@jest/globals'
import { EventEmitter } from 'node:events'
import { Readable } from 'node:stream'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/RipGrep/RipGrep.js', () => {
  return {
    spawn: jest.fn(() => {
      throw new Error('not implemented')
    }),
    exec: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})

jest.unstable_mockModule('../src/parts/ToTextSearchResult/ToTextSearchResult.js', () => {
  return {
    toTextSearchResult: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})

const TextSearch = await import('../src/parts/TextSearch/TextSearch.js')
const RipGrep = await import('../src/parts/RipGrep/RipGrep.js')
const ToTextSearchResult = await import('../src/parts/ToTextSearchResult/ToTextSearchResult.js')

test('search - no results', async () => {
  // @ts-ignore
  RipGrep.spawn.mockImplementation(() => {
    const emitter = new EventEmitter()
    const stdout = new Readable({
      read() {},
    })
    const childProcess = {
      on(event, listener) {
        emitter.on(event, listener)
      },
      once(event, listener) {
        emitter.once(event, listener)
      },
      stdout,
      stderr: {},
      kill() {},
    }
    setTimeout(() => {
      stdout.emit('end')
      stdout.emit('close')
      emitter.emit('close')
    })
    return childProcess
  })
  expect(await TextSearch.search('/test', 'document')).toEqual({
    results: [],
    stats: expect.any(Object),
    limitHit: false,
  })
})

test('search - one result', async () => {
  // @ts-ignore
  ToTextSearchResult.toTextSearchResult.mockImplementation(() => {
    return [
      {
        end: 23,
        lineNumber: 151,
        start: 20,
        text: 'elect Destination Location" wizard page\n',
        type: 2,
      },
    ]
  }) // @ts-ignore
  RipGrep.spawn.mockImplementation(() => {
    const emitter = new EventEmitter()
    const stdout = new Readable({
      read() {},
    })
    const childProcess = {
      on(event, listener) {
        emitter.on(event, listener)
      },
      once(event, listener) {
        emitter.once(event, listener)
      },
      stdout,
      stderr: {},
      kill() {},
    }
    setTimeout(() => {
      stdout.push(
        `{"type":"begin","data":{"path":{"text":"./index.html"}}}
{"type":"match","data":{"path":{"text":"./index.html"},"lines":{"text":"<!DOCTYPE html>\\n"},"line_number":1,"absolute_offset":0,"submatches":[{"match":{"text":"DOC"},"start":2,"end":5}]}}
`
      )
      setTimeout(() => {
        stdout.emit('end')
        stdout.emit('close')
        emitter.emit('close')
      })
    })
    return childProcess
  })
  expect(await TextSearch.search('/test', 'document')).toEqual({
    results: [
      {
        end: 0,
        lineNumber: 0,
        start: 0,
        text: './index.html',
        type: 1,
      },
      {
        end: 23,
        lineNumber: 151,
        start: 20,
        text: 'elect Destination Location" wizard page\n',
        type: 2,
      },
    ],
    stats: expect.any(Object),
    limitHit: false,
  })
  expect(ToTextSearchResult.toTextSearchResult).toHaveBeenCalledTimes(1)
  expect(ToTextSearchResult.toTextSearchResult).toHaveBeenCalledWith({
    data: {
      absolute_offset: 0,
      line_number: 1,
      lines: {
        text: '<!DOCTYPE html>\n',
      },
      path: {
        text: './index.html',
      },
      submatches: [
        {
          end: 5,
          match: {
            text: 'DOC',
          },
          start: 2,
        },
      ],
    },
    type: 'match',
  })
})

test('search - one result split across multiple chunks', async () => {
  // @ts-ignore
  ToTextSearchResult.toTextSearchResult.mockImplementation(() => {
    return [
      {
        end: 23,
        lineNumber: 151,
        start: 20,
        text: 'elect Destination Location" wizard page\n',
        type: 2,
      },
    ]
  })
  // @ts-ignore
  RipGrep.spawn.mockImplementation(() => {
    const emitter = new EventEmitter()
    const stdout = new Readable({
      read() {},
    })
    const childProcess = {
      on(event, listener) {
        emitter.on(event, listener)
      },
      once(event, listener) {
        emitter.once(event, listener)
      },
      stdout,
      stderr: {},
      kill() {},
    }
    setTimeout(() => {
      stdout.push(
        `{"type":"begin","data":{"path":{"text":"./index.html"}}}
{"type":"match","data":{"path":{"text":"`
      )
      stdout.push(
        `./index.html"},"lines":{"text":"<!DOCTYPE html>\\n"},"line_number":1,"absolute_offset":0,"submatches":[{"match":{"text":"DOC"},"start":2,"end":5}]}}
`
      )
      stdout.emit('end')
      stdout.emit('close')
      emitter.emit('close')
    })
    return childProcess
  })
  expect(await TextSearch.search('/test', 'document')).toEqual({
    results: [
      {
        end: 0,
        lineNumber: 0,
        start: 0,
        text: './index.html',
        type: 1,
      },
      {
        end: 23,
        lineNumber: 151,
        start: 20,
        text: 'elect Destination Location" wizard page\n',
        type: 2,
      },
    ],
    stats: expect.any(Object),
    limitHit: false,
  })
  expect(ToTextSearchResult.toTextSearchResult).toHaveBeenCalledTimes(1)
  expect(ToTextSearchResult.toTextSearchResult).toHaveBeenCalledWith({
    data: {
      absolute_offset: 0,
      line_number: 1,
      lines: {
        text: '<!DOCTYPE html>\n',
      },
      path: {
        text: './index.html',
      },
      submatches: [
        {
          end: 5,
          match: {
            text: 'DOC',
          },
          start: 2,
        },
      ],
    },
    type: 'match',
  })
})

// TODO when parsing line fails, function should throw an error without crashsing the process
test('search - error with parsing line', async () => {
  // @ts-ignore
  ToTextSearchResult.toTextSearchResult.mockImplementation(() => {
    throw new TypeError(`Cannot read properties of undefined (reading length)`)
  })
  // @ts-ignore
  RipGrep.spawn.mockImplementation(() => {
    const emitter = new EventEmitter()
    const stdout = new Readable({
      read() {},
    })
    const childProcess = {
      on(event, listener) {
        emitter.on(event, listener)
      },
      once(event, listener) {
        emitter.once(event, listener)
      },
      stdout,
      stderr: {},
      kill() {},
    }
    setTimeout(() => {
      stdout.push(
        `{"type":"begin","data":{"path":{"text":"./index.html"}}}
{"type":"match","data":{"path":{"text":"./index.html"},"lines":{"text":"<!DOCTYPE html>\\n"},"line_number":1,"absolute_offset":0,"submatches":[{"match":{"text":"DOC"},"start":2,"end":5}]}}
`
      )
      emitter.emit('close')
    })
    return childProcess
  })
  await expect(TextSearch.search('/test', 'document')).rejects.toThrowError(new TypeError('Cannot read properties of undefined (reading length)'))
})
