// @ts-nocheck
import { jest, beforeAll, afterAll, test, expect, beforeEach, afterEach } from '@jest/globals'
import * as ErrorCodes from '../src/parts/ErrorCodes/ErrorCodes.ts'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/BabelParser/BabelParser.ts', () => {
  return {
    parse: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})

const TryToGetActualErrorMessageWhenNetworkRequestSucceeds = await import(
  '../src/parts/TryToGetActualErrorMessageWhenNetworkRequestSucceeds/TryToGetActualErrorMessageWhenNetworkRequestSucceeds.ts'
)

const BabelParser = await import('../src/parts/BabelParser/BabelParser.ts')

class NoErrorThrownError extends Error {}

/**
 *
 * @param {any} promise
 * @returns {Promise<Error>}
 *  */
const getError = async (promise) => {
  try {
    await promise
    throw new NoErrorThrownError()
  } catch (error) {
    // @ts-ignore
    return error
  }
}

class BabelSyntaxError extends SyntaxError {
  constructor(message, loc) {
    super(message)
    this.code = ErrorCodes.BABEL_PARSER_SYNTAX_ERROR
    this.loc = loc
  }
}

test('tryToGetActualErrorMessage - syntax error - identifier has already been declared', async () => {
  // @ts-ignore
  BabelParser.parse.mockImplementation(() => {
    throw new BabelSyntaxError("Identifier 'x' has already been declared. (3:4)", {
      line: 3,
      column: 4,
    })
  })
  const error = await getError(
    TryToGetActualErrorMessageWhenNetworkRequestSucceeds.tryToGetActualErrorMessage(
      null,
      'test://extension.ts',
      new Response(`let x = 1

let x = 2

export const activate = () => {}
`),
    ),
  )
  expect(error).toBeInstanceOf(SyntaxError)
  expect(error.message).toBe("Identifier 'x' has already been declared.")
  expect(error.stack).toMatch(`Identifier 'x' has already been declared.
  at test://extension.ts:3:5`)
})

test('tryToGetActualErrorMessage - syntax error - missing semicolon', async () => {
  // @ts-ignore
  BabelParser.parse.mockImplementation(() => {
    throw new BabelSyntaxError('SyntaxError: Missing semicolon. (1:2)', {
      line: 1,
      column: 2,
    })
  })
  const error = await getError(
    TryToGetActualErrorMessageWhenNetworkRequestSucceeds.tryToGetActualErrorMessage(
      null,
      'test://extension.ts',
      new Response(`[]0
`),
    ),
  )
  expect(error).toBeInstanceOf(SyntaxError)
  expect(error.message).toBe('SyntaxError: Missing semicolon.')
  expect(error.stack).toMatch(`SyntaxError: Missing semicolon.
  at test://extension.ts:1:3`)
})

test('tryToGetActualErrorMessage - missing content type header', async () => {
  // @ts-ignore
  BabelParser.parse.mockImplementation(() => {
    return {
      program: {
        body: [],
      },
    }
  })
  const response = new Response('', {})
  response.headers.delete('Content-Type')
  expect(await TryToGetActualErrorMessageWhenNetworkRequestSucceeds.tryToGetActualErrorMessage(null, 'test://extension.ts', response)).toBe(
    'Failed to import test://extension.ts: Missing Content-Type header for javascript',
  )
})
