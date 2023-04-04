const GetHelpfulChildProcessError = require('../src/parts/GetHelpfulChildProcessError/GetHelpfulChildProcessError.js')

test('getHelpfulChildProcessError - modules not supported in electron', () => {
  const stderr = `(node:120184) Warning: To load an ES module, set "type": "module" in the package.json or use the .mjs extension.
(Use \`exe --trace-warnings ...\` to show where the warning was created)
/test/language-features-typescript/packages/node/src/typeScriptClient.js:1
import * as IpcChild from './parts/IpcChild/IpcChild.js'
^^^^^^

SyntaxError: Cannot use import statement outside a module
    at Object.compileFunction (node:vm:360:18)
    at wrapSafe (node:internal/modules/cjs/loader:1095:15)
    at Module._compile (node:internal/modules/cjs/loader:1130:27)
    at Module._extensions..js (node:internal/modules/cjs/loader:1229:10)
    at Module.load (node:internal/modules/cjs/loader:1044:32)
    at Module._load (node:internal/modules/cjs/loader:885:12)
    at f._load (node:electron/js2c/asar_bundle:2:13330)
    at node:electron/js2c/utility_init:2:5946
    at node:electron/js2c/utility_init:2:5961
    at node:electron/js2c/utility_init:2:5965

Node.js v18.12.1`
  const error = GetHelpfulChildProcessError.getHelpfulChildProcessError('', '', stderr)
  expect(error).toBeInstanceOf(Error)
  expect(error.message).toBe(`SyntaxError: Cannot use import statement outside a module`)
  expect(error.stack).toBe(`SyntaxError: Cannot use import statement outside a module
    at /test/language-features-typescript/packages/node/src/typeScriptClient.js:1
    at Object.compileFunction (node:vm:360:18)
    at wrapSafe (node:internal/modules/cjs/loader:1095:15)
    at Module._compile (node:internal/modules/cjs/loader:1130:27)
    at Module._extensions..js (node:internal/modules/cjs/loader:1229:10)
    at Module.load (node:internal/modules/cjs/loader:1044:32)
    at Module._load (node:internal/modules/cjs/loader:885:12)
    at f._load (node:electron/js2c/asar_bundle:2:13330)
    at node:electron/js2c/utility_init:2:5946
    at node:electron/js2c/utility_init:2:5961
    at node:electron/js2c/utility_init:2:5965`)
})

test('getHelpfulChildProcessError - top-level await error', () => {
  const stderr = `/test/file.js:1
await import("/test/language-features-typescript/packages/node/src/typeScriptClient.js")
^^^^^
SyntaxError: await is only valid in async functions and the top level bodies of modules
    at Object.compileFunction (node:vm:360:18)
    at wrapSafe (node:internal/modules/cjs/loader:1095:15)
    at Module._compile (node:internal/modules/cjs/loader:1130:27)
    at Module._extensions..js (node:internal/modules/cjs/loader:1229:10)
    at Module.load (node:internal/modules/cjs/loader:1044:32)
    at Module._load (node:internal/modules/cjs/loader:885:12)
    at f._load (node:electron/js2c/asar_bundle:2:13330)
    at node:electron/js2c/utility_init:2:5946
    at node:electron/js2c/utility_init:2:5961
    at node:electron/js2c/utility_init:2:5965

Node.js v18.12.1`
  const error = GetHelpfulChildProcessError.getHelpfulChildProcessError('', '', stderr)
  expect(error).toBeInstanceOf(Error)
  expect(error.message).toBe(`SyntaxError: await is only valid in async functions and the top level bodies of modules`)
  expect(error.stack).toBe(`SyntaxError: await is only valid in async functions and the top level bodies of modules
    at /test/file.js:1
    at Object.compileFunction (node:vm:360:18)
    at wrapSafe (node:internal/modules/cjs/loader:1095:15)
    at Module._compile (node:internal/modules/cjs/loader:1130:27)
    at Module._extensions..js (node:internal/modules/cjs/loader:1229:10)
    at Module.load (node:internal/modules/cjs/loader:1044:32)
    at Module._load (node:internal/modules/cjs/loader:885:12)
    at f._load (node:electron/js2c/asar_bundle:2:13330)
    at node:electron/js2c/utility_init:2:5946
    at node:electron/js2c/utility_init:2:5961
    at node:electron/js2c/utility_init:2:5965`)
})

test('getHelpfulChildProcessError - module not found error', () => {
  const stderr = `node:internal/errors:484
    ErrorCaptureStackTrace(err);
    ^

Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/test/language-features-typescript/packages/node/src/parts/RestoreJsonRpcError/RestoreJsonRpcError.js' imported from /test/language-features-typescript/packages/node/src/parts/JsonRpc/JsonRpc.js
    at new NodeError (node:internal/errors:393:5)
    at finalizeResolution (node:internal/modules/esm/resolve:323:11)
    at moduleResolve (node:internal/modules/esm/resolve:922:10)
    at defaultResolve (node:internal/modules/esm/resolve:1130:11)
    at nextResolve (node:internal/modules/esm/loader:163:28)
    at ESMLoader.resolve (node:internal/modules/esm/loader:841:30)
    at ESMLoader.getModuleJob (node:internal/modules/esm/loader:424:18)
    at ModuleWrap.<anonymous> (node:internal/modules/esm/module_job:76:40)
    at link (node:internal/modules/esm/module_job:75:36) {
  code: 'ERR_MODULE_NOT_FOUND'
}

Node.js v18.12.1`
  const error = GetHelpfulChildProcessError.getHelpfulChildProcessError('', '', stderr)
  expect(error).toBeInstanceOf(Error)
  expect(error.message).toBe(
    `Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/test/language-features-typescript/packages/node/src/parts/RestoreJsonRpcError/RestoreJsonRpcError.js' imported from /test/language-features-typescript/packages/node/src/parts/JsonRpc/JsonRpc.js`
  )
  expect(error.stack)
    .toBe(`Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/test/language-features-typescript/packages/node/src/parts/RestoreJsonRpcError/RestoreJsonRpcError.js' imported from /test/language-features-typescript/packages/node/src/parts/JsonRpc/JsonRpc.js
    at /test/language-features-typescript/packages/node/src/parts/JsonRpc/JsonRpc.js
    at new NodeError (node:internal/errors:393:5)
    at finalizeResolution (node:internal/modules/esm/resolve:323:11)
    at moduleResolve (node:internal/modules/esm/resolve:922:10)
    at defaultResolve (node:internal/modules/esm/resolve:1130:11)
    at nextResolve (node:internal/modules/esm/loader:163:28)
    at ESMLoader.resolve (node:internal/modules/esm/loader:841:30)
    at ESMLoader.getModuleJob (node:internal/modules/esm/loader:424:18)
    at ModuleWrap.<anonymous> (node:internal/modules/esm/module_job:76:40)
    at link (node:internal/modules/esm/module_job:75:36) {`)
})
