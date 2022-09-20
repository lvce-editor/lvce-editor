import * as QuickPickEntryId from '../QuickPickEntryId/QuickPickEntryId.js'

// prettier-ignore
export const load = (moduleId) => {
  switch (moduleId) {
    case QuickPickEntryId.CommandPalette:
      return import('../QuickPickEntriesCommand/QuickPickEntriesCommand.js')
    case QuickPickEntryId.File:
      return import('../QuickPickEntriesFile/QuickPickEntriesFile.js')
    case QuickPickEntryId.EveryThing:
      return import('../QuickPickEntriesEverything/QuickPickEntriesEverything.js')
    case QuickPickEntryId.Noop:
      return import('../QuickPickEntriesNoop/QuickPickNoop.js')
    case QuickPickEntryId.Number:
      return import('../QuickPickEntriesNumber/QuickPickEntriesNumber.js')
    case QuickPickEntryId.Recent:
      return import('../QuickPickEntriesOpenRecent/QuickPickEntriesOpenRecent.js')
    case QuickPickEntryId.ColorTheme:
      return import('../QuickPickEntriesColorTheme/QuickPickEntriesColorTheme.js')
    case QuickPickEntryId.Symbol:
      return import('../QuickPickEntriesSymbol/QuickPickEntriesSymbol.js')
    case QuickPickEntryId.View:
      return import('../QuickPickEntriesView/QuickPickEntriesView.js')
    case QuickPickEntryId.WorkspaceSymbol:
      return import('../QuickPickEntriesWorkspaceSymbol/QuickPickEntriesWorkspaceSymbol.js')
    default:
      throw new Error(`unknown module "${moduleId}"`)
  }
}
