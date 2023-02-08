import { jest } from '@jest/globals'
import * as ErrorCodes from '../src/parts/ErrorCodes/ErrorCodes.js'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/BabelParser/BabelParser.js', () => {
  return {
    parse: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})

const TryToGetActualErrorMessageWhenNetworkRequestSucceeds = await import(
  '../src/parts/TryToGetActualErrorMessageWhenNetworkRequestSucceeds/TryToGetActualErrorMessageWhenNetworkRequestSucceeds.js'
)

const BabelParser = await import('../src/parts/BabelParser/BabelParser.js')

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
      'test://extension.js',
      new Response(`let x = 1

let x = 2

export const activate = () => {}
`)
    )
  )
  expect(error).toBeInstanceOf(SyntaxError)
  expect(error.message).toBe("Identifier 'x' has already been declared.")
  expect(error.stack).toMatch(`Identifier 'x' has already been declared.
  at test://extension.js:3:5`)
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
      'test://extension.js',
      new Response(`[]0
`)
    )
  )
  expect(error).toBeInstanceOf(SyntaxError)
  expect(error.message).toBe('SyntaxError: Missing semicolon.')
  expect(error.stack).toMatch(`SyntaxError: Missing semicolon.
  at test://extension.js:1:3`)
})
