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
    `    at Object.<anonymous> (/test/packages/shared-process/node_modules/fs-extra/lib/copy/copy-sync.js:3:12)`,
  ])
})

test('cleanStack - syntax error', () => {
  const stack = `/test/packages/main-process/src/parts/GetFirstNodeWorkerEvent/GetFirstNodeWorkerEvent.js:3
export const getFirstNodeWorkerEvent = async (worker) => {
^^^^^^

SyntaxError: Unexpected token 'export'
    at Object.compileFunction (node:vm:360:18)
    at wrapSafe (node:internal/modules/cjs/loader:1095:15)
    at Module._compile (node:internal/modules/cjs/loader:1130:27)
    at Module._extensions..js (node:internal/modules/cjs/loader:1229:10)
    at Module.load (node:internal/modules/cjs/loader:1044:32)
    at Module._load (node:internal/modules/cjs/loader:885:12)
    at f._load (node:electron/js2c/asar_bundle:2:13330)
    at Module.require (node:internal/modules/cjs/loader:1068:19)
    at require (node:internal/modules/cjs/helpers:103:18)
    at Object.<anonymous> (/test/packages/main-process/src/parts/CliForwardToSharedProcess/CliForwardToSharedProcess.js:4:33)`
  expect(CleanStack.cleanStack(stack)).toEqual([
    `    at /test/packages/main-process/src/parts/GetFirstNodeWorkerEvent/GetFirstNodeWorkerEvent.js:3`,
    `    at Object.<anonymous> (/test/packages/main-process/src/parts/CliForwardToSharedProcess/CliForwardToSharedProcess.js:4:33)`,
  ])
})

test('cleanStack - command not found error', () => {
  const stack = `Error: Unknown command "ProcessExplorerContextMenu.showContextMenu"
    at exports.invoke (/test/packages/main-process/src/parts/Command/Command.js:66:13)
    at async exports.getResponse (/test/packages/main-process/src/parts/GetResponse/GetResponse.js:7:20)
    at async MessagePortMain.handlePortMessage (/test/packages/main-process/src/parts/ElectronWindowProcessExplorer/ElectronWindowProcessExplorer.js:56:24)`
  expect(CleanStack.cleanStack(stack)).toEqual([
    '    at invoke (/test/packages/main-process/src/parts/Command/Command.js:66:13)',
    '    at async getResponse (/test/packages/main-process/src/parts/GetResponse/GetResponse.js:7:20)',
    '    at async MessagePortMain.handlePortMessage (/test/packages/main-process/src/parts/ElectronWindowProcessExplorer/ElectronWindowProcessExplorer.js:56:24)',
  ])
})
