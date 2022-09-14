import * as QuickPickModuleId from '../QuickPickModuleId/QuickPickModuleId.js'

export const load = (moduleId) => {
  switch (moduleId) {
    case QuickPickModuleId.CommandPalette:
      return import('../QuickPick/QuickPickCommand.js')
    case QuickPickModuleId.File:
      return import('../QuickPick/QuickPickFile.js')
    case QuickPickModuleId.EveryThing:
      return import('../QuickPick/QuickPickEverything.js')
    case QuickPickModuleId.Noop:
      return import('../QuickPick/QuickPickNoop.js')
    case QuickPickModuleId.Number:
      return import('../QuickPick/QuickPickNumber.js')
    case QuickPickModuleId.Recent:
      return import('../QuickPick/QuickPickOpenRecent.js')
    case QuickPickModuleId.ColorTheme:
      return import('../QuickPick/QuickPickColorTheme.js')
    case QuickPickModuleId.Symbol:
      return import('../QuickPick/QuickPickSymbol.js')
    case QuickPickModuleId.View:
      return import('../QuickPick/QuickPickView.js')
    case QuickPickModuleId.WorkspaceSymbol:
      return import('../QuickPick/QuickPickWorkspaceSymbol.js')
    default:
      throw new Error(`unknown module "${moduleId}"`)
  }
}
