import { beforeAll, afterAll, test, expect, beforeEach, afterEach } from '@jest/globals'
import * as CleanStack from '../src/parts/CleanStack/CleanStack.js'

test('cleanStack - firefox stack', () => {
  const stack = `ReferenceError: Menu is not defined
handleKeyArrowDownMenuOpen@test:///packages/renderer-worker/src/parts/ViewletTitleBarMenuBar/ViewletTitleBarMenuBarHandleKeyArrowDownMenuOpen.js:4:27
ifElseFunction@test:///packages/renderer-worker/src/parts/ViewletTitleBarMenuBar/ViewletTitleBarMenuBarIfElse.js:5:14
TitleBarMenuBar/lazy/handleKeyArrowDown@test:///packages/renderer-worker/src/parts/ViewletManager/ViewletManager.js:115:30
Object.handleKeyBinding@test:///packages/renderer-worker/src/parts/KeyBindings/KeyBindings.js:36:3
handleMessageFromRendererProcess@test:///packages/renderer-worker/src/parts/RendererProcess/RendererProcess.js:45:3`
  expect(CleanStack.cleanStack(stack)).toEqual([
    'handleKeyArrowDownMenuOpen@test:///packages/renderer-worker/src/parts/ViewletTitleBarMenuBar/ViewletTitleBarMenuBarHandleKeyArrowDownMenuOpen.js:4:27',
    'ifElseFunction@test:///packages/renderer-worker/src/parts/ViewletTitleBarMenuBar/ViewletTitleBarMenuBarIfElse.js:5:14',
    'TitleBarMenuBar/lazy/handleKeyArrowDown@test:///packages/renderer-worker/src/parts/ViewletManager/ViewletManager.js:115:30',
    'Object.handleKeyBinding@test:///packages/renderer-worker/src/parts/KeyBindings/KeyBindings.js:36:3',
    'handleMessageFromRendererProcess@test:///packages/renderer-worker/src/parts/RendererProcess/RendererProcess.js:45:3',
  ])
})

test('cleanStack - remove restoreJsonRpcError function from stack trace', () => {
  const stack = `AssertionError: expected value to be of type string
    at ExtensionHost.getColorThemeJson (file:///test/packages/shared-process/src/parts/ExtensionManagement/ExtensionManagementColorTheme.js:32:10)
    at Module.restoreJsonRpcError (http://localhost:3000/packages/renderer-worker/src/parts/RestoreJsonRpcError/RestoreJsonRpcError.js:35:70)
    at Module.invoke (http://localhost:3000/packages/renderer-worker/src/parts/JsonRpc/JsonRpc.js:23:47)
    at async Module.invoke (http://localhost:3000/packages/renderer-worker/src/parts/SharedProcess/SharedProcess.js:81:18)
    at async applyColorTheme (http://localhost:3000/packages/renderer-worker/src/parts/ColorTheme/ColorTheme.js:82:28)
    at async Module.hydrate (http://localhost:3000/packages/renderer-worker/src/parts/ColorTheme/ColorTheme.js:121:5)
    at async Module.startup (http://localhost:3000/packages/renderer-worker/src/parts/Workbench/Workbench.js:73:3)
    at async main (http://localhost:3000/packages/renderer-worker/src/rendererWorkerMain.js:7:3)`
  expect(CleanStack.cleanStack(stack)).toEqual([
    '    at ExtensionHost.getColorThemeJson (file:///test/packages/shared-process/src/parts/ExtensionManagement/ExtensionManagementColorTheme.js:32:10)',
    '    at async invoke (http://localhost:3000/packages/renderer-worker/src/parts/SharedProcess/SharedProcess.js:81:18)',
    '    at async applyColorTheme (http://localhost:3000/packages/renderer-worker/src/parts/ColorTheme/ColorTheme.js:82:28)',
    '    at async hydrate (http://localhost:3000/packages/renderer-worker/src/parts/ColorTheme/ColorTheme.js:121:5)',
    '    at async startup (http://localhost:3000/packages/renderer-worker/src/parts/Workbench/Workbench.js:73:3)',
    '    at async main (http://localhost:3000/packages/renderer-worker/src/rendererWorkerMain.js:7:3)',
  ])
})

test('cleanStack - clean Object prefix from stack trace', () => {
  const stack = `Error: Failed to activate extension builtin.language-features-typescript: NotImplementedError: not implemented
    at Object.createNodeIpc (http://localhost:3000/packages/extension-host-worker/src/parts/ExtensionHostNodeIpc/ExtensionHostNodeIpc.js:4:9)`
  expect(CleanStack.cleanStack(stack)).toEqual([
    '    at createNodeIpc (http://localhost:3000/packages/extension-host-worker/src/parts/ExtensionHostNodeIpc/ExtensionHostNodeIpc.js:4:9)',
  ])
})

test('cleanStack - clean async Object prefix from stack trace', () => {
  const stack = `VError: Failed to save file "/test/index.html": Failed to write to file "/test/index.html": EACCES: permission denied, open '/test/index.html'
    at FileSystem.writeFile (/test/packages/shared-process/src/parts/FileSystem/FileSystem.js:74:11)
    at async handleJsonRpcMessage (/test/packages/shared-process/src/parts/HandleJsonRpcMessage/HandleJsonRpcMessage.js:8:24)
    at invoke (JsonRpc.js:14:38)
    at async invoke3 (SharedProcess.js:45:18)
    at async Object.writeFile14 (FileSystemDisk.js:30:3)
    at async writeFile4 (FileSystem.js:39:3)
    at async save (EditorCommandSave.js:26:5)
    at async executeViewletCommand (Viewlet.js:359:20)
    at async executeEditorCommand (ViewletMain.js:458:3)
    at async save2 (ViewletMain.js:480:3)`
  expect(CleanStack.cleanStack(stack)).toEqual([
    '    at FileSystem.writeFile (/test/packages/shared-process/src/parts/FileSystem/FileSystem.js:74:11)',
    '    at async handleJsonRpcMessage (/test/packages/shared-process/src/parts/HandleJsonRpcMessage/HandleJsonRpcMessage.js:8:24)',
    '    at async invoke3 (SharedProcess.js:45:18)',
    '    at async writeFile14 (FileSystemDisk.js:30:3)',
    '    at async writeFile4 (FileSystem.js:39:3)',
    '    at async save (EditorCommandSave.js:26:5)',
    '    at async executeViewletCommand (Viewlet.js:359:20)',
    '    at async executeEditorCommand (ViewletMain.js:458:3)',
    '    at async save2 (ViewletMain.js:480:3)',
  ])
})
