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
