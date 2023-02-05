import * as MergeStacks from '../src/parts/MergeStacks/MergeStacks.js'

test('mergeStacks', () => {
  const parentStack = `VError: Failed to link extension: Failed to create symbolic link from C:/test/debug-node/packages/extension/ to /test/linked-extensions/builtin.debug-node: EPERM: operation not permitted, symlink '/test/debug-node/packages/extension' -> '/test/linked-extensions/builtin.debug-node'
  at Module.link (/test/packages/shared-process/src/parts/ExtensionLink/ExtensionLink.js:40:11)
  at async Module.handleCliArgs (/test/packages/shared-process/src/parts/CliLink/CliLink.js:9:5)
  at async Module.handleCliArgs (/test/packages/shared-process/src/parts/Cli/Cli.js:24:5)
  at async main (/test/packages/shared-process/src/sharedProcessMain.js:30:5)`
  const childStack = `VError: Failed to create symbolic link from C:/test/debug-node/packages/extension/ to /test/linked-extensions/builtin.debug-node: EPERM: operation not permitted, symlink '/test/debug-node/packages/extension' -> '/test/linked-extensions/builtin.debug-node'
    at Module.createSymLink (/test/packages/shared-process/src/parts/SymLink/SymLink.js:12:11)
    at async Module.link (/test/packages/shared-process/src/parts/ExtensionLink/ExtensionLink.js:35:5)
    at async Module.handleCliArgs (/test/packages/shared-process/src/parts/CliLink/CliLink.js:9:5)
    at async Module.handleCliArgs (/test/packages/shared-process/src/parts/Cli/Cli.js:24:5)
    at async main (/test/packages/shared-process/src/sharedProcessMain.js:30:5)`
  expect(MergeStacks.mergeStacks(parentStack, childStack))
    .toBe(`VError: Failed to link extension: Failed to create symbolic link from C:/test/debug-node/packages/extension/ to /test/linked-extensions/builtin.debug-node: EPERM: operation not permitted, symlink '/test/debug-node/packages/extension' -> '/test/linked-extensions/builtin.debug-node'
    at Module.createSymLink (/test/packages/shared-process/src/parts/SymLink/SymLink.js:12:11)
    at async Module.link (/test/packages/shared-process/src/parts/ExtensionLink/ExtensionLink.js:35:5)
    at async Module.handleCliArgs (/test/packages/shared-process/src/parts/CliLink/CliLink.js:9:5)
    at async Module.handleCliArgs (/test/packages/shared-process/src/parts/Cli/Cli.js:24:5)
    at async main (/test/packages/shared-process/src/sharedProcessMain.js:30:5)`)
})
