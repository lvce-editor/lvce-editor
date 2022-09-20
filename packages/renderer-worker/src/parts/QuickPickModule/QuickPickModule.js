import * as QuickPickModuleId from '../QuickPickModuleId/QuickPickModuleId.js'

export const load = (moduleId) => {
  switch (moduleId) {
    case QuickPickModuleId.CommandPalette:
      return import('../QuickPickEntries/QuickPickEntriesCommand.js/index.js')
    case QuickPickModuleId.File:
      return import('../QuickPickEntries/QuickPickEntriesFile.js')
    case QuickPickModuleId.EveryThing:
      return import(
        '../QuickPickEntries/QuickPickEntriesEverything.js/index.js.js'
      )
    case QuickPickModuleId.Noop:
      return import('../QuickPick/QuickPickNoop.js')
    case QuickPickModuleId.Number:
      return import('../QuickPick/QuickPickNumber.js')
    case QuickPickModuleId.Recent:
      return import('../QuickPick/QuickPickOpenRecent.js')
    case QuickPickModuleId.ColorTheme:
      return import('../QuickPickEntries/QuickPickEntriesColorTheme.js')
    case QuickPickModuleId.Symbol:
      return import('../QuickPickEntries/QuickPickEntriesSymbol.js/index.js')
    case QuickPickModuleId.View:
      return import('../QuickPick/QuickPickView.js')
    case QuickPickModuleId.WorkspaceSymbol:
      return import('../QuickPick/QuickPickWorkspaceSymbol.js')
    default:
      throw new Error(`unknown module "${moduleId}"`)
  }
}
