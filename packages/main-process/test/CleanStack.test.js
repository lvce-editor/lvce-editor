const CleanStack = require('../src/parts/CleanStack/CleanStack.js')

test('cleanStack - error inside node_modules', () => {
  const stack = `Error: Cannot find module 'graceful-fs'
Require stack:
- /test/packages/shared-process/node_modules/fs-extra/lib/copy/copy-sync.js
- /test/packages/shared-process/node_modules/rename-overwrite/index.js
- /test/packages/shared-process/node_modules/symlink-dir/dist/index.js
    at Module._resolveFilename (node:internal/modules/cjs/loader:1002:15)
    at Module._load (node:internal/modules/cjs/loader:848:27)
    at f._load (node:electron/js2c/asar_bundle:2:13330)
    at Module.require (node:internal/modules/cjs/loader:1068:19)
    at require (node:internal/modules/cjs/helpers:103:18)
    at Object.<anonymous> (/test/packages/shared-process/node_modules/fs-extra/lib/copy/copy-sync.js:3:12)
    at Module._compile (node:internal/modules/cjs/loader:1174:14)
    at Module._extensions..js (node:internal/modules/cjs/loader:1229:10)
    at Module.load (node:internal/modules/cjs/loader:1044:32)
    at Module._load (node:internal/modules/cjs/loader:885:12)`
  expect(CleanStack.cleanStack(stack)).toEqual([
    `Error: Cannot find module 'graceful-fs'`,
    `Require stack:`,
    `- /test/packages/shared-process/node_modules/fs-extra/lib/copy/copy-sync.js`,
    `- /test/packages/shared-process/node_modules/rename-overwrite/index.js`,
    `- /test/packages/shared-process/node_modules/symlink-dir/dist/index.js`,
    `    at Object.<anonymous> (/test/packages/shared-process/node_modules/fs-extra/lib/copy/copy-sync.js:3:12)`,
  ])
})
