const GetModulesErrorStack = require('../src/parts/GetModulesErrorStack/GetModulesErrorStack.js')

test('getModulesErrorStack', () => {
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
