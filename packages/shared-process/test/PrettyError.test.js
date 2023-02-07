import { jest } from '@jest/globals'
import * as ErrorCodes from '../src/parts/ErrorCodes/ErrorCodes.js'

jest.unstable_mockModule('node:fs', () => ({
  readFileSync: jest.fn(() => {
    throw new Error('not implemented')
  }),
}))

const fs = await import('node:fs')
const PrettyError = await import('../src/parts/PrettyError/PrettyError.js')

test('prepare - module not found error', async () => {
  const error = new Error()
  error.message = `[ERR_MODULE_NOT_FOUND]: Cannot find package 'vscode-ripgrep-with-github-api-error-fix' imported from /test/packages/shared-process/src/parts/RgPath/RgPath.js`
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
  // @ts-ignore
  error.code = ErrorCodes.ERR_MODULE_NOT_FOUND
  // @ts-ignore
  fs.readFileSync.mockImplementation(() => {
    return `export { rgPath } from 'vscode-ripgrep-with-github-api-error-fix121'`
  })
  const prettyError = PrettyError.prepare(error)
  expect(prettyError).toEqual({
    message: `[ERR_MODULE_NOT_FOUND]: Cannot find package 'vscode-ripgrep-with-github-api-error-fix' imported from /test/packages/shared-process/src/parts/RgPath/RgPath.js`,
    stack: `Error [ERR_MODULE_NOT_FOUND]: Cannot find package 'vscode-ripgrep-with-github-api-error-fix' imported from /test/packages/shared-process/src/parts/RgPath/RgPath.js
    at /test/packages/shared-process/src/parts/RgPath/RgPath.js:1:24
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
    at loadCommand`,
    codeFrame: `
> 1 | export { rgPath } from 'vscode-ripgrep-with-github-api-error-fix121'
    |                        ^`.trim(),
  })
})

test('prepare - maximum call stack size exceeded', async () => {
  const error = new RangeError('Maximum call stack size exceeded')
  error.stack = ` RangeError: Maximum call stack size exceeded
  at execSync (test:///test/packages/shared-process/src/parts/ExecCommand/ExecCommand.js:24:3)
  at execSync (test:///test/packages/shared-process/src/parts/ExecCommand/ExecCommand.js:24:10)
  at execSync (test:///test/packages/shared-process/src/parts/ExecCommand/ExecCommand.js:24:10)
  at execSync (test:///test/packages/shared-process/src/parts/ExecCommand/ExecCommand.js:24:10)
  at execSync (test:///test/packages/shared-process/src/parts/ExecCommand/ExecCommand.js:24:10)
  at execSync (test:///test/packages/shared-process/src/parts/ExecCommand/ExecCommand.js:24:10)
  at execSync (test:///test/packages/shared-process/src/parts/ExecCommand/ExecCommand.js:24:10)
  at execSync (test:///test/packages/shared-process/src/parts/ExecCommand/ExecCommand.js:24:10)
  at execSync (test:///test/packages/shared-process/src/parts/ExecCommand/ExecCommand.js:24:10)
  at execSync (test:///test/packages/shared-process/src/parts/ExecCommand/ExecCommand.js:24:10)`
  // @ts-ignore
  fs.readFileSync.mockImplementation(() => {
    return `import { spawn } from 'node:child_process'
import { once } from 'node:events'
import * as ExecPromise from '../ExecPromise/ExecPromise.js'
import * as Hash from '../Hash/Hash.js'

export const execCommand = async (command, args, options) => {
  const { stdout, stderr } = await ExecPromise.execPromise(command, args, options)
  return {
    stdout,
    stderr,
  }
}

export const execCommandHash = async (command, args, options) => {
  const child = spawn(command, args, options)
  const hash = Hash.createHash('sha1')
  child.stdout.pipe(hash)
  await once(child, 'exit')
  const finalHash = hash.digest('hex')
  return finalHash
}

export const execSync = (command) => {
  return execSync(command).toString().trim()
}
`
  })
  const prettyError = PrettyError.prepare(error)
  expect(prettyError).toEqual({
    message: 'Maximum call stack size exceeded',
    stack: `  at execSync (test:///test/packages/shared-process/src/parts/ExecCommand/ExecCommand.js:24:3)
  at execSync (test:///test/packages/shared-process/src/parts/ExecCommand/ExecCommand.js:24:10)
  at execSync (test:///test/packages/shared-process/src/parts/ExecCommand/ExecCommand.js:24:10)
  at execSync (test:///test/packages/shared-process/src/parts/ExecCommand/ExecCommand.js:24:10)
  at execSync (test:///test/packages/shared-process/src/parts/ExecCommand/ExecCommand.js:24:10)
  at execSync (test:///test/packages/shared-process/src/parts/ExecCommand/ExecCommand.js:24:10)
  at execSync (test:///test/packages/shared-process/src/parts/ExecCommand/ExecCommand.js:24:10)
  at execSync (test:///test/packages/shared-process/src/parts/ExecCommand/ExecCommand.js:24:10)
  at execSync (test:///test/packages/shared-process/src/parts/ExecCommand/ExecCommand.js:24:10)
  at execSync (test:///test/packages/shared-process/src/parts/ExecCommand/ExecCommand.js:24:10)`,
    codeFrame: `  22 |
  23 | export const execSync = (command) => {
> 24 |   return execSync(command).toString().trim()
     |   ^
  25 | }
  26 |`,
  })
})
