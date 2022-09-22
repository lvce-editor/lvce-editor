import * as QuickPickEntryId from '../QuickPickEntryId/QuickPickEntryId.js'

// prettier-ignore
export const load = (moduleId) => {
  switch (moduleId) {
    case QuickPickEntryId.CommandPalette:
    case QuickPickEntryId.File:
    case QuickPickEntryId.EveryThing:
    case QuickPickEntryId.WorkspaceSymbol:
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
    default:
      throw new Error(`unknown module "${moduleId}"`)
  }
}
