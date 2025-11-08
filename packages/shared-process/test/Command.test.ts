import { beforeEach, expect, jest, test } from '@jest/globals'

beforeEach(() => {
  jest.resetAllMocks()
  Command.state.commands = Object.create(null)
  Command.state.pendingModules = Object.create(null)
})

jest.unstable_mockModule('../src/parts/ModuleMap/ModuleMap.js', () => {
  return {
    getModuleId: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})

const Command = await import('../src/parts/Command/Command.js')
const ModuleMap = await import('../src/parts/ModuleMap/ModuleMap.js')

class NoErrorThrownError extends Error {}

class NodeError extends Error {
  code: any
  constructor(message, code) {
    super(message)
    this.code = code
  }
}

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

test('register', () => {
  const mockFn = jest.fn()
  Command.register(-12, mockFn)
  expect(Command.state.commands[-12]).toBe(mockFn)
})

test('execute - command already registered', async () => {
  const mockFn = jest.fn()
  Command.register(-12, mockFn)
  await Command.execute(-12, 'abc')
  expect(mockFn).toHaveBeenCalledTimes(1)
  expect(mockFn).toHaveBeenCalledWith('abc')
})

test('execute - command already registered but throws error', async () => {
  const mockFn = jest.fn(() => {
    throw new Error('Oops')
  })
  Command.register(-12, mockFn)
  expect(() => Command.execute(-12, 'abc')).toThrow(new Error('Oops'))
})

test('execute - error - module has syntax error', async () => {
  // @ts-ignore
  ModuleMap.getModuleId.mockImplementation(() => {
    return 21
  })
  Command.state.load = async () => {
    const error = new SyntaxError(`Unexpected token ','`)
    error.stack = `SyntaxError: Unexpected token ','`
    throw error
  }
  const error = await getError(Command.execute('test.test'))
  expect(error.message).toBe("Failed to load command test.test: failed to load module 21: SyntaxError: Unexpected token ','")
  // TODO
  // expect(error.stack).toMatch(
  //   "VError: Failed to load command test.test: VError: failed to load module 21: SyntaxError: Unexpected token ','"
  // )
  expect(error.stack).toMatch('  at loadCommand')
})

test('execute - error - ERR_MODULE_NOT_FOUND', async () => {
  // @ts-ignore
  ModuleMap.getModuleId.mockImplementation(() => {
    return 22
  })
  Command.state.load = async () => {
    const error = new NodeError(
      `[ERR_MODULE_NOT_FOUND]: Cannot find package 'vscode-ripgrep-with-github-api-error-fix' imported from /test/packages/shared-process/src/parts/RgPath/RgPath.js`,
      'ERR_MODULE_NOT_FOUND',
    )
    error.stack = `Error [ERR_MODULE_NOT_FOUND]: Cannot find package 'vscode-ripgrep-with-github-api-error-fix' imported from /test/packages/shared-process/src/parts/RgPath/RgPath.js
    at __node_internal_captureLargerStackTrace (node:internal/errors:477:5)
    at new NodeError (node:internal/errors:387:5)
    at packageResolve (node:internal/modules/esm/resolve:957:9)
    at moduleResolve (node:internal/modules/esm/resolve:1006:20)
    at defaultResolve (node:internal/modules/esm/resolve:1220:11)
    at nextResolve (node:internal/modules/esm/loader:165:28)
    at ESMLoader.resolve (node:internal/modules/esm/loader:844:30)
    at ESMLoader.getModuleJob (node:internal/modules/esm/loader:431:18)
    at ModuleWrap.<anonymous> (node:internal/modules/esm/module_job:76:40)
    at link (node:internal/modules/esm/module_job:75:36)
    at loadCommand`
    throw error
  }
  const error = await getError(Command.execute('test.test'))
  expect(error.message).toBe(
    "Failed to load command test.test: failed to load module 22: [ERR_MODULE_NOT_FOUND]: Cannot find package 'vscode-ripgrep-with-github-api-error-fix' imported from /test/packages/shared-process/src/parts/RgPath/RgPath.js",
  )
  expect(error.stack).toMatch(
    "Error [ERR_MODULE_NOT_FOUND]: Cannot find package 'vscode-ripgrep-with-github-api-error-fix' imported from /test/packages/shared-process/src/parts/RgPath/RgPath.js",
  )
  expect(error.stack).toMatch('  at loadCommand')
})
