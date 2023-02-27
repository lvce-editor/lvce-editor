import * as CleanStack from '../src/parts/CleanStack/CleanStack.js'

test('cleanStack - remove useless Promise.all', () => {
  const stack = `    at file:///test/packages/shared-process/src/parts/IpcParentWithNodeWorker/IpcParentWithNodeWorker.js:5:1
    at async Promise.all (index 0)
    at async Module.create (file:///test/packages/shared-process/src/parts/IpcParent/IpcParent.js:4:18)
    at async createPtyHost (file:///test/packages/shared-process/src/parts/Terminal/Terminal.js:52:19)
    at async Module.create (file:///test/packages/shared-process/src/parts/Terminal/Terminal.js:80:23)`
  expect(CleanStack.cleanStack(stack)).toEqual([
    `    at file:///test/packages/shared-process/src/parts/IpcParentWithNodeWorker/IpcParentWithNodeWorker.js:5:1`,
    `    at async create (file:///test/packages/shared-process/src/parts/IpcParent/IpcParent.js:4:18)`,
    `    at async createPtyHost (file:///test/packages/shared-process/src/parts/Terminal/Terminal.js:52:19)`,
    `    at async create (file:///test/packages/shared-process/src/parts/Terminal/Terminal.js:80:23)`,
  ])
})

test('cleanStack - remove Module prefix', () => {
  const stack = `AssertionError: expected value to be of type string
    at Module.string (file:///test/packages/shared-process/src/parts/Assert/Assert.js:50:11)
    at Object.getColorThemeJson [as ExtensionHost.getColorThemeJson] (file:///test/packages/shared-process/src/parts/ExtensionManagement/ExtensionManagementColorTheme.js:32:10)
    at executeCommandAsync (file:///test/packages/shared-process/src/parts/Command/Command.js:68:33)
    at async Module.getResponse (file:///test/packages/shared-process/src/parts/GetResponse/GetResponse.js:21:9)
    at async WebSocket.handleMessage (file:///test/packages/shared-process/src/parts/Socket/Socket.js:32:22)`
  expect(CleanStack.cleanStack(stack)).toEqual([
    '    at string (file:///test/packages/shared-process/src/parts/Assert/Assert.js:50:11)',
    '    at ExtensionHost.getColorThemeJson (file:///test/packages/shared-process/src/parts/ExtensionManagement/ExtensionManagementColorTheme.js:32:10)',
    '    at executeCommandAsync (file:///test/packages/shared-process/src/parts/Command/Command.js:68:33)',
    '    at async getResponse (file:///test/packages/shared-process/src/parts/GetResponse/GetResponse.js:21:9)',
    '    at async WebSocket.handleMessage (file:///test/packages/shared-process/src/parts/Socket/Socket.js:32:22)',
  ])
})

test('cleanStack - remove Object prefix', () => {
  const stack = `VError: Failed to read file "/test/settings.json": EACCES: permission denied, open '/test/settings.json'
    at Object.readFile [as FileSystem.readFile] (file:///test/packages/shared-process/src/parts/FileSystem/FileSystem.js:50:11)
    at async Module.getResponse (file:///test/packages/shared-process/src/parts/GetResponse/GetResponse.js:21:9)
    at async WebSocket.handleMessage (file:///test/packages/shared-process/src/parts/Socket/Socket.js:27:22)`
  expect(CleanStack.cleanStack(stack)).toEqual([
    '    at FileSystem.readFile (file:///test/packages/shared-process/src/parts/FileSystem/FileSystem.js:50:11)',
    '    at async getResponse (file:///test/packages/shared-process/src/parts/GetResponse/GetResponse.js:21:9)',
    '    at async WebSocket.handleMessage (file:///test/packages/shared-process/src/parts/Socket/Socket.js:27:22)',
  ])
})
