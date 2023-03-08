import { jest } from '@jest/globals'
import { AssertionError } from '../src/parts/AssertionError/AssertionError.js'
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

test('prepare - VError with AssertionError cause', async () => {
  const cause = new AssertionError(`expected value to be of type string`)
  cause.stack = `AssertionError: expected value to be of type string
    at Module.string (http://localhost:3000/packages/renderer-worker/src/parts/Assert/Assert.js:58:11)
    at applyColorTheme (http://localhost:3000/packages/renderer-worker/src/parts/ColorTheme/ColorTheme.js:82:12)
    at Module.hydrate (http://localhost:3000/packages/renderer-worker/src/parts/ColorTheme/ColorTheme.js:123:11)
    at Module.startup (http://localhost:3000/packages/renderer-worker/src/parts/Workbench/Workbench.js:73:20)
    at async main (http://localhost:3000/packages/renderer-worker/src/rendererWorkerMain.js:7:3)"`
  const error = new VError(cause, `Failed to apply color theme \"undefined\"`)
  // @ts-ignore
  Ajax.getText.mockImplementation(() => {
    return `import * as Command from '../Command/Command.js'
import * as Css from '../Css/Css.js'
import * as Logger from '../Logger/Logger.js'
import * as Meta from '../Meta/Meta.js'
import * as Platform from '../Platform/Platform.js'
import * as PlatformType from '../PlatformType/PlatformType.js'
import * as Preferences from '../Preferences/Preferences.js'
import * as SharedProcess from '../SharedProcess/SharedProcess.js'
import { VError } from '../VError/VError.js'
import * as ErrorHandling from '../ErrorHandling/ErrorHandling.js'
import * as Assert from '../Assert/Assert.js'

// TODO by default color theme should come from local storage, session storage, cache storage, indexeddb or blob url -> fast initial load
// actual color theme can be computed after workbench has loaded (most times will be the same and doesn't need to be computed)

export const state = {
  watchedTheme: '',
}

const FALLBACK_COLOR_THEME_ID = 'slime'

const getColorThemeJsonFromSharedProcess = async (colorThemeId) => {
  // const extensions = await ExtensionMeta.getExtensions()
  // for(const extension of extensions){
  //   if(extension.status==='rejected'){
  //     continue
  //   }
  //   if(!extension.colorThemes){
  //     continue
  //   }
  //   for(const colorTheme of extension.colorThemes){
  //     if(colorTheme.id !== colorThemeId){
  //       continue
  //     }
  //     const absolutePath = \`\${extension.path}/\${colorTheme.path}\`
  //   }
  // }
  return SharedProcess.invoke(/* ExtensionHost.getColorThemeJson */ 'ExtensionHost.getColorThemeJson', /* colorThemeId */ colorThemeId)
}

const getColorThemeUrlWeb = (colorThemeId) => {
  return \`/extensions/builtin.theme-\${colorThemeId}/color-theme.json\`
}

const getColorThemeJsonFromStaticFolder = (colorThemeId) => {
  const url = getColorThemeUrlWeb(colorThemeId)
  // TODO handle error ?
  return Command.execute(/* Ajax.getJson */ 'Ajax.getJson', /* url */ url)
}

const getFallbackColorTheme = async () => {
  const assetDir = Platform.getAssetDir()
  const url = \`\${assetDir}/themes/fallback_theme.json\`
  return Command.execute(/* Ajax.getJson */ 'Ajax.getJson', /* url */ url)
}

// TODO json parsing should also happen in renderer worker
// so that all validation is here (json parsing errors, invalid shape, ...)

const getColorThemeJson = (colorThemeId) => {
  if (Platform.platform === PlatformType.Web) {
    return getColorThemeJsonFromStaticFolder(colorThemeId)
  }
  return getColorThemeJsonFromSharedProcess(colorThemeId)
}

export const getColorThemeCss = async (colorThemeId, colorThemeJson) => {
  const colorThemeCss = await Command.execute(
    /* ColorThemeFromJson.createColorThemeFromJson */ 'ColorThemeFromJson.createColorThemeFromJson',
    /* colorThemeId */ colorThemeId,
    /* colorThemeJson */ colorThemeJson
  )
  return colorThemeCss
  // TODO generate color theme from jsonc
}

const getMetaThemeColor = (colorThemeJson) => {
  return colorThemeJson && colorThemeJson.colors && colorThemeJson.colors.TitleBarBackground
}
const applyColorTheme = async (colorThemeId) => {
  try {
    Assert.string(colorThemeId)
    state.colorTheme = colorThemeId
    const colorThemeJson = await getColorThemeJson(colorThemeId)
    const colorThemeCss = await getColorThemeCss(colorThemeId, colorThemeJson)
    await Css.setInlineStyle('ContributedColorTheme', colorThemeCss)
    if (Platform.platform === PlatformType.Web) {
      const themeColor = getMetaThemeColor(colorThemeJson) || ''
      await Meta.setThemeColor(themeColor)
    }
    if (Platform.platform !== PlatformType.Web && Preferences.get('development.watchColorTheme')) {
      watch(colorThemeId)
    }
  } catch (error) {
    throw new VError(error, \`Failed to apply color theme "\${colorThemeId}"\`)
  }
}

export const setColorTheme = async (colorThemeId) => {
  await applyColorTheme(colorThemeId)
  // TODO should preferences throw errors or should it call handleError directly?
  await Preferences.set('workbench.colorTheme', colorThemeId)
}

export const watch = async (id) => {
  if (state.watchedTheme === id) {
    return
  }
  state.watchedTheme = id
  await SharedProcess.invoke('ExtensionHost.watchColorTheme', id)
}

export const reload = async () => {
  const colorThemeId = Preferences.get('workbench.colorTheme')
  await applyColorTheme(colorThemeId)
}

// TODO test this, and also the error case
// TODO have icon theme, color theme together (maybe)
export const hydrate = async () => {
  const colorThemeId = Preferences.get('workbench.colorTheme')
  try {
    await applyColorTheme(colorThemeId)
  } catch (error) {
    if (colorThemeId === FALLBACK_COLOR_THEME_ID) {
      throw error
    }
    ErrorHandling.handleError(error)
    await applyColorTheme(FALLBACK_COLOR_THEME_ID)
  }
}
`
  })
  const prettyError = await PrettyError.prepare(error)
  expect(prettyError).toEqual({
    message: 'Failed to apply color theme "undefined": AssertionError: expected value to be of type string',
    stack: `    at applyColorTheme (http://localhost:3000/packages/renderer-worker/src/parts/ColorTheme/ColorTheme.js:82:12)
    at hydrate (http://localhost:3000/packages/renderer-worker/src/parts/ColorTheme/ColorTheme.js:123:11)
    at startup (http://localhost:3000/packages/renderer-worker/src/parts/Workbench/Workbench.js:73:20)
    at async main (http://localhost:3000/packages/renderer-worker/src/rendererWorkerMain.js:7:3)\"`,
    codeFrame: `  80 | const applyColorTheme = async (colorThemeId) => {
  81 |   try {
> 82 |     Assert.string(colorThemeId)
     |            ^
  83 |     state.colorTheme = colorThemeId
  84 |     const colorThemeJson = await getColorThemeJson(colorThemeId)
  85 |     const colorThemeCss = await getColorThemeCss(colorThemeId, colorThemeJson)`,
    type: 'VError',
    _error: error,
  })
  expect(Ajax.getText).toHaveBeenCalledTimes(1)
  expect(Ajax.getText).toHaveBeenCalledWith(`http://localhost:3000/packages/renderer-worker/src/parts/ColorTheme/ColorTheme.js`)
})

test('prepare - regex error', async () => {
  const error = new TypeError(`increaseIndentRegex.text is not a function`)
  error.stack = `TypeError: increaseIndentRegex.text is not a function
    at shouldIncreaseIndent (http://localhost:3000/packages/renderer-worker/src/parts/EditorCommand/EditorCommandInsertLineBreak.js:24:30)
    at getChanges (http://localhost:3000/packages/renderer-worker/src/parts/EditorCommand/EditorCommandInsertLineBreak.js:53:11)
    at insertLineBreak (http://localhost:3000/packages/renderer-worker/src/parts/EditorCommand/EditorCommandInsertLineBreak.js:86:19)
    at async EditorText/lazy/insertLineBreak (http://localhost:3000/packages/renderer-worker/src/parts/ViewletManager/ViewletManager.js:108:24)
    at async handleKeyBinding (http://localhost:3000/packages/renderer-worker/src/parts/KeyBindings/KeyBindings.js:36:3)
    at async handleMessageFromRendererProcess (http://localhost:3000/packages/renderer-worker/src/parts/RendererProcess/RendererProcess.js:45:3)`
  // @ts-ignore
  Ajax.getText.mockImplementation(() => {
    return `import * as Editor from '../Editor/Editor.js'
import * as EditOrigin from '../EditOrigin/EditOrigin.js'
import * as TextDocument from '../TextDocument/TextDocument.js'
import * as Languages from '../Languages/Languages.js'
import * as EditorSelection from '../EditorSelection/EditorSelection.js'

const getIncreaseIndentRegex = (languageConfiguration) => {
  if (
    languageConfiguration &&
    languageConfiguration.indentationRules &&
    languageConfiguration.indentationRules.increaseIndentPattern &&
    typeof languageConfiguration.indentationRules.increaseIndentPattern === 'string'
  ) {
    const regex = new RegExp(languageConfiguration.indentationRules.increaseIndentPattern)
    return regex
  }
  return undefined
}

const shouldIncreaseIndent = (before, increaseIndentRegex) => {
  if (!increaseIndentRegex) {
    return false
  }
  return increaseIndentRegex.text(before)
}

const getChanges = (lines, selections, languageConfiguration) => {
  const changes = []
  const increaseIndentRegex = getIncreaseIndentRegex(languageConfiguration)
  for (let i = 0; i < selections.length; i += 4) {
    const selectionStartRow = selections[i]
    const selectionStartColumn = selections[i + 1]
    const selectionEndRow = selections[i + 2]
    const selectionEndColumn = selections[i + 3]
    const start = {
      rowIndex: selectionStartRow,
      columnIndex: selectionStartColumn,
    }
    const end = {
      rowIndex: selectionEndRow,
      columnIndex: selectionEndColumn,
    }
    const range = {
      start,
      end,
    }

    if (EditorSelection.isEmpty(selectionStartRow, selectionStartColumn, selectionEndRow, selectionEndColumn)) {
      const line = lines[selectionStartRow]
      const before = line.slice(0, selectionStartColumn)
      const after = line.slice(selectionStartColumn)
      const indent = TextDocument.getIndent(before)
      if (shouldIncreaseIndent(before, increaseIndentRegex)) {
        changes.push({
          start: start,
          end: end,
          inserted: ['', indent + '  ', ''],
          deleted: TextDocument.getSelectionText({ lines }, range),
          origin: EditOrigin.InsertLineBreak,
        })
      } else {
        changes.push({
          start: start,
          end: end,
          inserted: ['', indent],
          deleted: TextDocument.getSelectionText({ lines }, range),
          origin: EditOrigin.InsertLineBreak,
        })
      }
    } else {
      changes.push({
        start: start,
        end: end,
        inserted: ['', ''],
        deleted: TextDocument.getSelectionText({ lines }, range),
        origin: EditOrigin.InsertLineBreak,
      })
    }
  }
  return changes
}

export const insertLineBreak = async (editor) => {
  const { lines, selections } = editor
  const languageConfiguration = await Languages.getLanguageConfiguration(editor)
  const changes = getChanges(lines, selections, languageConfiguration)
  return Editor.scheduleDocumentAndCursorsSelections(editor, changes)
}
`
  })
  const prettyError = await PrettyError.prepare(error)
  expect(prettyError).toEqual({
    message: `increaseIndentRegex.text is not a function`,
    stack: `    at shouldIncreaseIndent (http://localhost:3000/packages/renderer-worker/src/parts/EditorCommand/EditorCommandInsertLineBreak.js:24:30)
    at getChanges (http://localhost:3000/packages/renderer-worker/src/parts/EditorCommand/EditorCommandInsertLineBreak.js:53:11)
    at insertLineBreak (http://localhost:3000/packages/renderer-worker/src/parts/EditorCommand/EditorCommandInsertLineBreak.js:86:19)
    at async EditorText/lazy/insertLineBreak (http://localhost:3000/packages/renderer-worker/src/parts/ViewletManager/ViewletManager.js:108:24)
    at async handleKeyBinding (http://localhost:3000/packages/renderer-worker/src/parts/KeyBindings/KeyBindings.js:36:3)
    at async handleMessageFromRendererProcess (http://localhost:3000/packages/renderer-worker/src/parts/RendererProcess/RendererProcess.js:45:3)`,
    codeFrame: `  22 |     return false
  23 |   }
> 24 |   return increaseIndentRegex.text(before)
     |                              ^
  25 | }
  26 |
  27 | const getChanges = (lines, selections, languageConfiguration) => {`,
    type: 'TypeError',
    _error: error,
  })
})
