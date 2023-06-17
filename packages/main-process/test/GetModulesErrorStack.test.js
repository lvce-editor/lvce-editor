const GetModulesErrorStack = require('../src/parts/GetModulesErrorStack/GetModulesErrorStack.js')

test('getModulesErrorStack - esm error', () => {
  const stderr = `node:internal/modules/cjs/loader:1293
      throw err;
      ^

Error [ERR_REQUIRE_ESM]: require() of ES Module /test/packages/pty-host/src/ptyHostMain.js not supported.
Instead change the require of ptyHostMain.js in null to a dynamic import() which is available in all CommonJS modules.
    at f._load (node:electron/js2c/asar_bundle:2:13330)
    at node:electron/js2c/utility_init:2:5946
    at node:electron/js2c/utility_init:2:5961
    at node:electron/js2c/utility_init:2:5965
    at f._load (node:electron/js2c/asar_bundle:2:13330) {
  code: 'ERR_REQUIRE_ESM'\n" +
}

Node.js v18.14.0
`
  const stack = GetModulesErrorStack.getModulesErrorStack(stderr)
  expect(stack).toEqual([
    'Error [ERR_REQUIRE_ESM]: require() of ES Module /test/packages/pty-host/src/ptyHostMain.js not supported. Instead change the require of ptyHostMain.js in null to a dynamic import() which is available in all CommonJS modules.',
    '    at f._load (node:electron/js2c/asar_bundle:2:13330)',
    '    at node:electron/js2c/utility_init:2:5946',
    '    at node:electron/js2c/utility_init:2:5961',
    '    at node:electron/js2c/utility_init:2:5965',
    '    at f._load (node:electron/js2c/asar_bundle:2:13330) {',
  ])
})

test('getModulesErrorStack - export error', () => {
  const stderr = `file:///test/packages/pty-host/src/parts/HandleElectronMessagePort/HandleElectronMessagePort.js:5
import { MessagePortMain } from 'electron'
          ^^^^^^^^^^^^^^^
SyntaxError: Named export 'MessagePortMain' not found. The requested module 'electron' is a CommonJS module, which may not support all module.exports as named exports.
CommonJS modules can always be imported via the default export, for example using:

import pkg from 'electron';
const { MessagePortMain } = pkg;

    at ModuleJob._instantiate (node:internal/modules/esm/module_job:124:21)
    at async ModuleJob.run (node:internal/modules/esm/module_job:190:5)

Node.js v18.14.0
`
  const stack = GetModulesErrorStack.getModulesErrorStack(stderr)
  expect(stack).toEqual([
    `SyntaxError: Named export 'MessagePortMain' not found. The requested module 'electron' is a CommonJS module, which may not support all module.exports as named exports. CommonJS modules can always be imported via the default export, for example using:  import pkg from 'electron'; const { MessagePortMain } = pkg;`,
    '    at file:///test/packages/pty-host/src/parts/HandleElectronMessagePort/HandleElectronMessagePort.js:5',
    '    at ModuleJob._instantiate (node:internal/modules/esm/module_job:124:21)',
    '    at async ModuleJob.run (node:internal/modules/esm/module_job:190:5)',
  ])
})
