import { jest } from '@jest/globals'
import { VError } from '../src/parts/VError/VError.js'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/Ajax/Ajax.js', () => {
  return {
    getText: jest.fn(() => {
      throw new Error('not implemented')
    }),
    getJson: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})

jest.unstable_mockModule('../src/parts/SourceMap/SourceMap.js', () => {
  return {
    getOriginalPosition: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})

const PrettyError = await import('../src/parts/PrettyError/PrettyError.js')
const Ajax = await import('../src/parts/Ajax/Ajax.js')
const SourceMap = await import('../src/parts/SourceMap/SourceMap.js')

test('prepare - fetch codeFrame', async () => {
  // @ts-ignore
  Ajax.getText.mockImplementation(() => {
    return `export const handleKeyArrowDownMenuOpen = (state) => {
  const { menus } = state
  const menu = menus.at(-1)
  const newFocusedIndex = Menu.getIndexToFocusNext(menu)
  const newMenus = [
    ...menus.slice(0, -1),
    {
      ...menu,
      focusedIndex: newFocusedIndex,
    },
  ]
  return {
    ...state,
    menus: newMenus,
  }
}
`
  })
  const error = new ReferenceError('Menu is not defined')
  error.stack = `ReferenceError: Menu is not defined
  at handleKeyArrowDownMenuOpen (test:///packages/renderer-worker/src/parts/ViewletTitleBarMenuBar/ViewletTitleBarMenuBarHandleKeyArrowDownMenuOpen.js:4:27)
  at ifElseFunction (test:///packages/renderer-worker/src/parts/ViewletTitleBarMenuBar/ViewletTitleBarMenuBarIfElse.js:5:14)
  at TitleBarMenuBar/lazy/handleKeyArrowDown [as TitleBarMenuBar.handleKeyArrowDown] (test:///packages/renderer-worker/src/parts/ViewletManager/ViewletManager.js:115:30)
  at async Object.handleKeyBinding [as KeyBindings.handleKeyBinding] (test:///packages/renderer-worker/src/parts/KeyBindings/KeyBindings.js:36:3)
  at async handleMessageFromRendererProcess (test:///packages/renderer-worker/src/parts/RendererProcess/RendererProcess.js:45:3)`
  const prettyError = await PrettyError.prepare(error)
  expect(prettyError).toEqual({
    message: 'Menu is not defined',
    codeFrame: `  2 |   const { menus } = state
  3 |   const menu = menus.at(-1)
> 4 |   const newFocusedIndex = Menu.getIndexToFocusNext(menu)
    |                           ^
  5 |   const newMenus = [
  6 |     ...menus.slice(0, -1),
  7 |     {`,
    stack: `  at handleKeyArrowDownMenuOpen (test:///packages/renderer-worker/src/parts/ViewletTitleBarMenuBar/ViewletTitleBarMenuBarHandleKeyArrowDownMenuOpen.js:4:27)
  at ifElseFunction (test:///packages/renderer-worker/src/parts/ViewletTitleBarMenuBar/ViewletTitleBarMenuBarIfElse.js:5:14)
  at TitleBarMenuBar/lazy/handleKeyArrowDown [as TitleBarMenuBar.handleKeyArrowDown] (test:///packages/renderer-worker/src/parts/ViewletManager/ViewletManager.js:115:30)
  at async Object.handleKeyBinding [as KeyBindings.handleKeyBinding] (test:///packages/renderer-worker/src/parts/KeyBindings/KeyBindings.js:36:3)
  at async handleMessageFromRendererProcess (test:///packages/renderer-worker/src/parts/RendererProcess/RendererProcess.js:45:3)`,
    type: 'ReferenceError',
    _error: error,
  })
})

test('prepare - fetch codeFrame - with sourcemap', async () => {
  // @ts-ignore
  Ajax.getText.mockImplementation((url) => {
    switch (url) {
      case 'test://packages/renderer-worker/dist/rendererWorkerMain.js':
        return `main();

//# sourceMappingURL=rendererWorkerMain.js.map
`
      case 'test://packages/renderer-worker/src/parts/Command/Command.js':
        return `import * as ModuleMap from '../ModuleMap/ModuleMap.js'

const execute = () => {
  throw new Error(\`Command did not register "\${command}"\`)
}
`
      default:
        throw new Error(`unsupported url ${url}`)
    }
  })
  // @ts-ignore
  Ajax.getJson.mockImplementation((url) => {
    switch (url) {
      case 'test://packages/renderer-worker/dist/rendererWorkerMain.js.map':
        return {
          version: 3,
          sources: [],
          sourcesContent: [],
          mappings: ';;;',
          names: [],
        }
      default:
        throw new Error(`unsupported url ${url}`)
    }
  })
  // @ts-ignore
  SourceMap.getOriginalPosition.mockImplementation(() => {
    return {
      source: '../src/parts/Command/Command.js',
      originalLine: 4,
      originalColumn: 13,
    }
  })
  const error = new Error('Command did not register: "ElectronWindow.openNew"')
  error.stack = `Error: Command did not register "ElectronWindow.openNew"
  at test://packages/renderer-worker/dist/rendererWorkerMain.js:353:17
  at async selectIndexNone2 (test://packages/renderer-worker/dist/rendererWorkerMain.js:32978:7)
  at async TitleBarMenuBar/lazy/handleMenuMouseDown (test://packages/renderer-worker/dist/rendererWorkerMain.js:7329:28)
  at async handleMessageFromRendererProcess (test://packages/renderer-worker/dist/rendererWorkerMain.js:897:7)`
  const prettyError = await PrettyError.prepare(error)
  expect(prettyError).toEqual({
    message: `Command did not register: "ElectronWindow.openNew"`,
    codeFrame: `  2 |
  3 | const execute = () => {
> 4 |   throw new Error(\`Command did not register \"\${command}\"\`)
    |             ^
  5 | }
  6 |`,
    stack: `  at test://packages/renderer-worker/dist/rendererWorkerMain.js:353:17
  at async selectIndexNone2 (test://packages/renderer-worker/dist/rendererWorkerMain.js:32978:7)
  at async TitleBarMenuBar/lazy/handleMenuMouseDown (test://packages/renderer-worker/dist/rendererWorkerMain.js:7329:28)
  at async handleMessageFromRendererProcess (test://packages/renderer-worker/dist/rendererWorkerMain.js:897:7)`,
    type: 'Error',
    _error: error,
  })
})

test('prepare - fetch codeFrame - error', async () => {
  // @ts-ignore
  Ajax.getText.mockImplementation(() => {
    throw new TypeError('x is not a function')
  })
  const error = new ReferenceError('Menu is not defined')
  error.stack = `ReferenceError: Menu is not defined
  at handleKeyArrowDownMenuOpen (test:///packages/renderer-worker/src/parts/ViewletTitleBarMenuBar/ViewletTitleBarMenuBarHandleKeyArrowDownMenuOpen.js:4:27)
  at ifElseFunction (test:///packages/renderer-worker/src/parts/ViewletTitleBarMenuBar/ViewletTitleBarMenuBarIfElse.js:5:14)
  at TitleBarMenuBar/lazy/handleKeyArrowDown [as TitleBarMenuBar.handleKeyArrowDown] (test:///packages/renderer-worker/src/parts/ViewletManager/ViewletManager.js:115:30)
  at async Object.handleKeyBinding [as KeyBindings.handleKeyBinding] (test:///packages/renderer-worker/src/parts/KeyBindings/KeyBindings.js:36:3)
  at async handleMessageFromRendererProcess (test:///packages/renderer-worker/src/parts/RendererProcess/RendererProcess.js:45:3)`
  const spy = jest.spyOn(console, 'warn').mockImplementation(() => {})
  const prettyError = await PrettyError.prepare(error)
  expect(prettyError).toBe(error)
  expect(spy).toHaveBeenCalledTimes(1)
  expect(spy).toHaveBeenNthCalledWith(1, 'ErrorHandling Error: TypeError: x is not a function')
})

test('prepare - error without stack', async () => {
  // @ts-ignore
  Ajax.getText.mockImplementation(() => {
    throw new TypeError('x is not a function')
  })
  const error = new Error()
  error.message = `VError: Failed to import script http://localhost:3000/packages/extension-host-worker-tests/src/ample.tab-completion-provider-error-invalid-return-value-number.js: TypeError: Failed to fetch dynamically imported module: http://localhost:3000/packages/extension-host-worker-tests/src/ample.tab-completion-provider-error-invalid-return-value-number.jss`
  error.stack = `VError: Failed to import script http://localhost:3000/packages/extension-host-worker-tests/src/ample.tab-completion-provider-error-invalid-return-value-number.js: TypeError: Failed to fetch dynamically imported module: http://localhost:3000/packages/extension-host-worker-tests/src/ample.tab-completion-provider-error-invalid-return-value-number.jss`
  const spy = jest.spyOn(console, 'warn').mockImplementation(() => {})
  const prettyError = await PrettyError.prepare(error)
  expect(prettyError).toBe(error)
  expect(spy).not.toHaveBeenCalled()
})

test('prepare - error - with firefox stacktrace', async () => {
  // @ts-ignore
  Ajax.getText.mockImplementation(() => {
    return `export const handleKeyArrowDownMenuOpen = (state) => {
  const { menus } = state
  const menu = menus.at(-1)
  const newFocusedIndex = Menu.getIndexToFocusNext(menu)
  const newMenus = [
    ...menus.slice(0, -1),
    {
      ...menu,
      focusedIndex: newFocusedIndex,
    },
  ]
  return {
    ...state,
    menus: newMenus,
  }
}
`
  })
  const error = new ReferenceError('Menu is not defined')
  error.stack = `ReferenceError: Menu is not defined
handleKeyArrowDownMenuOpen@test:///packages/renderer-worker/src/parts/ViewletTitleBarMenuBar/ViewletTitleBarMenuBarHandleKeyArrowDownMenuOpen.js:4:27
ifElseFunction@test:///packages/renderer-worker/src/parts/ViewletTitleBarMenuBar/ViewletTitleBarMenuBarIfElse.js:5:14
TitleBarMenuBar/lazy/handleKeyArrowDown@test:///packages/renderer-worker/src/parts/ViewletManager/ViewletManager.js:115:30
Object.handleKeyBinding@test:///packages/renderer-worker/src/parts/KeyBindings/KeyBindings.js:36:3
handleMessageFromRendererProcess@test:///packages/renderer-worker/src/parts/RendererProcess/RendererProcess.js:45:3`
  const prettyError = await PrettyError.prepare(error)
  expect(prettyError).toEqual({
    message: 'Menu is not defined',
    codeFrame: `  2 |   const { menus } = state
  3 |   const menu = menus.at(-1)
> 4 |   const newFocusedIndex = Menu.getIndexToFocusNext(menu)
    |                           ^
  5 |   const newMenus = [
  6 |     ...menus.slice(0, -1),
  7 |     {`,
    stack: `handleKeyArrowDownMenuOpen@test:///packages/renderer-worker/src/parts/ViewletTitleBarMenuBar/ViewletTitleBarMenuBarHandleKeyArrowDownMenuOpen.js:4:27
ifElseFunction@test:///packages/renderer-worker/src/parts/ViewletTitleBarMenuBar/ViewletTitleBarMenuBarIfElse.js:5:14
TitleBarMenuBar/lazy/handleKeyArrowDown@test:///packages/renderer-worker/src/parts/ViewletManager/ViewletManager.js:115:30
Object.handleKeyBinding@test:///packages/renderer-worker/src/parts/KeyBindings/KeyBindings.js:36:3
handleMessageFromRendererProcess@test:///packages/renderer-worker/src/parts/RendererProcess/RendererProcess.js:45:3`,
    type: 'ReferenceError',
    _error: error,
  })
})

test('prepare - anonymous stack', async () => {
  // @ts-ignore
  Ajax.getText.mockImplementation(() => {
    throw new Error('not implemented')
  })
  const error = new TypeError('Illegal invocation')
  error.stack = `  at HTMLElement.focus (<anonymous>:1:65)
  at Module.setFocusedIndex (ViewletTitleBarMenuBar.js:109:22)`
  const prettyError = await PrettyError.prepare(error)
  expect(Ajax.getText).not.toHaveBeenCalled()
  expect(prettyError).toBe(error)
})

test('prepare - debugger eval code stack', async () => {
  // @ts-ignore
  Ajax.getText.mockImplementation(() => {
    throw new Error('not implemented')
  })
  const error = new ReferenceError('original is not defined')
  error.stack = `  HTMLElement.prototype.focus@debugger eval code:1:56
  setFocusedIndex@http://localhost:3000/packages/renderer-process/src/parts/ViewletTitleBarMenuBar/ViewletTitleBarMenuBar.js:109:22`
  const prettyError = await PrettyError.prepare(error)
  expect(Ajax.getText).not.toHaveBeenCalled()
  expect(prettyError).toBe(error)
})

test('prepare - RangeError - Maximum call stack size exceeded', async () => {
  // @ts-ignore
  Ajax.getText.mockImplementation(() => {
    return `import * as Command from '../Command/Command.js'
import * as TextSearchResultType from '../TextSearchResultType/TextSearchResultType.js'

export const getBulkReplacementEdits = (matches) => {
  const files = []
  const ranges = []
  let currentRanges = []
  for (const match of matches) {
    switch (match.type) {
      case TextSearchResultType.File:
        ranges.push(currentRanges.length, ...currentRanges)
        files.push(match.title)
        currentRanges = []
        break
      case TextSearchResultType.Match:
        currentRanges.push(match.lineNumber - 1, match.matchStart, match.lineNumber - 1, match.matchStart + match.matchLength)
        break
      default:
        break
    }
  }
  ranges.push(currentRanges.length, ...currentRanges)
  return {
    files,
    ranges: ranges.slice(1),
  }
}
`
  })
  const error = new RangeError('Maximum call stack size exceeded')
  error.stack = `RangeError: Maximum call stack size exceeded
    at Module.getBulkReplacementEdits (test:///packages/renderer-worker/src/parts/GetBulkReplacementEdits/GetBulkReplacementEdits.js:22:10)
    at actuallyReplaceAll (test:///packages/renderer-worker/src/parts/ViewletSearch/ViewletSearchReplaceAll.js:5:53)
    at replaceAll (test:///packages/renderer-worker/src/parts/ViewletSearch/ViewletSearchReplaceAll.js:17:9)
    at async Search/lazy/replaceAll (test:///packages/renderer-worker/src/parts/ViewletManager/ViewletManager.js:107:24)
    at async handleMessageFromRendererProcess (test:///packages/renderer-worker/src/parts/RendererProcess/RendererProcess.js:45:3)`
  const prettyError = await PrettyError.prepare(error)
  expect(prettyError).toEqual({
    message: 'Maximum call stack size exceeded',
    codeFrame: `  20 |     }
  21 |   }
> 22 |   ranges.push(currentRanges.length, ...currentRanges)
     |          ^
  23 |   return {
  24 |     files,
  25 |     ranges: ranges.slice(1),`,
    stack: `    at getBulkReplacementEdits (test:///packages/renderer-worker/src/parts/GetBulkReplacementEdits/GetBulkReplacementEdits.js:22:10)
    at actuallyReplaceAll (test:///packages/renderer-worker/src/parts/ViewletSearch/ViewletSearchReplaceAll.js:5:53)
    at replaceAll (test:///packages/renderer-worker/src/parts/ViewletSearch/ViewletSearchReplaceAll.js:17:9)
    at async Search/lazy/replaceAll (test:///packages/renderer-worker/src/parts/ViewletManager/ViewletManager.js:107:24)
    at async handleMessageFromRendererProcess (test:///packages/renderer-worker/src/parts/RendererProcess/RendererProcess.js:45:3)`,
    type: 'RangeError',
    _error: error,
  })
})

test('prepare - error - not implemented', async () => {
  // @ts-ignore
  Ajax.getText.mockImplementation(() => {
    return `import * as FileSystemWeb from '../FileSystem/FileSystemWeb.js'

export const textSearch = (scheme, root, query) => {
  throw new Error('not implemented')
}

`
  })
  const error = new Error('not implemented')
  error.stack = `Error: not implemented
    at Module.textSearch (test:///packages/renderer-worker/src/parts/TextSearch/TextSearchHtml.js:4:9)
    at Module.textSearch (test:///packages/renderer-worker/src/parts/TextSearch/TextSearch.js:24:34)
    at async Module.handleUpdate (test:///packages/renderer-worker/src/parts/ViewletSearch/ViewletSearchHandleUpdate.js:43:21)
    at async handleInput (test:///packages/renderer-worker/src/parts/ViewletManager/ViewletManager.js:51:24)
    at async handleMessageFromRendererProcess (test:///packages/renderer-worker/src/parts/RendererProcess/RendererProcess.js:45:3)`
  const prettyError = await PrettyError.prepare(error)
  expect(prettyError).toEqual({
    message: 'not implemented',
    codeFrame: `  2 |
  3 | export const textSearch = (scheme, root, query) => {
> 4 |   throw new Error('not implemented')
    |         ^
  5 | }
  6 |
  7 |`,
    stack: `    at textSearch (test:///packages/renderer-worker/src/parts/TextSearch/TextSearchHtml.js:4:9)
    at textSearch (test:///packages/renderer-worker/src/parts/TextSearch/TextSearch.js:24:34)
    at async handleUpdate (test:///packages/renderer-worker/src/parts/ViewletSearch/ViewletSearchHandleUpdate.js:43:21)
    at async handleInput (test:///packages/renderer-worker/src/parts/ViewletManager/ViewletManager.js:51:24)
    at async handleMessageFromRendererProcess (test:///packages/renderer-worker/src/parts/RendererProcess/RendererProcess.js:45:3)`,
    type: 'Error',
    _error: error,
  })
})

test('prepare - VError with code frame', async () => {
  const cause = new Error(`expected value to be of type string`)
  cause.stack = `AssertionError: expected value to be of type string
    at Object.getColorThemeJson [as ExtensionHost.getColorThemeJson] (file:///test/packages/shared-process/src/parts/ExtensionManagement/ExtensionManagementColorTheme.js:32:10)
    at executeCommandAsync (file:///test/packages/shared-process/src/parts/Command/Command.js:68:33)
    at async getResponse (file:///test/packages/shared-process/src/parts/GetResponse/GetResponse.js:21:9)
    at async WebSocket.handleMessage (file:///test/packages/shared-process/src/parts/Socket/Socket.js:27:22)
    at Module.restoreJsonRpcError (http://localhost:3000/packages/renderer-worker/src/parts/RestoreJsonRpcError/RestoreJsonRpcError.js:35:70)
    at Module.invoke (http://localhost:3000/packages/renderer-worker/src/parts/JsonRpc/JsonRpc.js:23:47)
    at async Module.invoke (http://localhost:3000/packages/renderer-worker/src/parts/SharedProcess/SharedProcess.js:81:18)
    at async applyColorTheme (http://localhost:3000/packages/renderer-worker/src/parts/ColorTheme/ColorTheme.js:82:28)
    at async Module.hydrate (http://localhost:3000/packages/renderer-worker/src/parts/ColorTheme/ColorTheme.js:121:5)
    at async Module.startup (http://localhost:3000/packages/renderer-worker/src/parts/Workbench/Workbench.js:73:3)
    at async main (http://localhost:3000/packages/renderer-worker/src/rendererWorkerMain.js:7:3)`
  // @ts-ignore
  cause.codeFrame = `  30 |
  31 | export const getColorThemeJson = async (colorThemeId) => {
> 32 |   Assert.string(colorThemeId)
     |          ^
  33 |   const extensions = await ExtensionManagement.getExtensions()
  34 |   const colorThemePath = await getColorThemePath(extensions, colorThemeId)
  35 |   if (!colorThemePath) {`
  const error = new VError(cause, `Failed to apply color theme \"undefined\"`)
  // @ts-ignore
  Ajax.getText.mockImplementation(() => {
    throw new Error('not implemented')
  })
  const prettyError = await PrettyError.prepare(error)
  expect(prettyError).toEqual({
    message: `Failed to apply color theme \"undefined\": expected value to be of type string`,
    stack: `    at ExtensionHost.getColorThemeJson (file:///test/packages/shared-process/src/parts/ExtensionManagement/ExtensionManagementColorTheme.js:32:10)
    at executeCommandAsync (file:///test/packages/shared-process/src/parts/Command/Command.js:68:33)
    at async getResponse (file:///test/packages/shared-process/src/parts/GetResponse/GetResponse.js:21:9)
    at async WebSocket.handleMessage (file:///test/packages/shared-process/src/parts/Socket/Socket.js:27:22)
    at restoreJsonRpcError (http://localhost:3000/packages/renderer-worker/src/parts/RestoreJsonRpcError/RestoreJsonRpcError.js:35:70)
    at invoke (http://localhost:3000/packages/renderer-worker/src/parts/JsonRpc/JsonRpc.js:23:47)
    at async invoke (http://localhost:3000/packages/renderer-worker/src/parts/SharedProcess/SharedProcess.js:81:18)
    at async applyColorTheme (http://localhost:3000/packages/renderer-worker/src/parts/ColorTheme/ColorTheme.js:82:28)
    at async hydrate (http://localhost:3000/packages/renderer-worker/src/parts/ColorTheme/ColorTheme.js:121:5)
    at async startup (http://localhost:3000/packages/renderer-worker/src/parts/Workbench/Workbench.js:73:3)
    at async main (http://localhost:3000/packages/renderer-worker/src/rendererWorkerMain.js:7:3)`,
    codeFrame: `  30 |
  31 | export const getColorThemeJson = async (colorThemeId) => {
> 32 |   Assert.string(colorThemeId)
     |          ^
  33 |   const extensions = await ExtensionManagement.getExtensions()
  34 |   const colorThemePath = await getColorThemePath(extensions, colorThemeId)
  35 |   if (!colorThemePath) {`,
    type: 'VError',
    _error: error,
  })
  expect(Ajax.getText).not.toHaveBeenCalled()
})
