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
  expect(error).toBeInstanceOf(SyntaxError)
  expect(error.message).toBe(`ES Modules are not supported in electron`)
  expect(error.stack).toBe(`ES Modules are not supported in electron
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
