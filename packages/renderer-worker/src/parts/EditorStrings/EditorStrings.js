import * as I18nString from '../I18NString/I18NString.js'

/**
 * @enum {string}
 */
const UiStrings = {
  OrganizeImports: 'Organize Imports',
  Copy: 'Copy',
  CopyLineDown: 'Copy Line Down',
  CopyLineUp: 'Copy Line Up',
  Cut: 'Cut',
  DuplicateSelection: 'Duplicate Selection',
  FindAllImplementations: 'Find All Implementations',
  FindAllReferences: 'Find All References',
  GoToDefinition: 'Go to Definition',
  GoToTypeDefinition: 'Go to Type Definition',
  MoveLineDown: 'Move Line Down',
  MoveLineUp: 'Move Line Up',
  NoDefinitionFound: 'No definition found',
  NoDefinitionFoundFor: "No definition found for '{PH1}'",
  NoTypeDefinitionFound: 'No type definition found',
  NoTypeDefinitionFoundFor: "No type definition found for '{PH1}'",
  Paste: 'Paste',
  Redo: 'Redo',
  SelectAll: 'Select All',
  Separator: 'Separator',
  ToggleBlockComment: 'Toggle Block Comment',
  ToggleLineComment: 'Toggle Line Comment',
  Undo: 'Undo',
  FormatDocument: 'Format Document',
  SourceActions: 'Source Actions',
  EditorShowHover: 'Show Hover',
  EditorFormatDocumentForced: 'Editor: Format Document (forced)',
  EditorSelectNextOccurrence: 'Editor: Select Next Occurrence',
  EditorSelectAllOccurrences: 'Editor: Select All Occurrences',
  EditorGoToDefinition: 'Editor: Go To Definition',
  EditorGoToTypeDefinition: 'Editor: Go To Type Definition',
  EditorSelectInsideString: 'Editor: Select Inside String',
  EditorIndent: 'Editor: Indent',
  EditorUnindent: 'Editor: Unindent',
  EditorSortLinesAscending: 'Editor: Sort Lines Ascending',
  EditorToggleComment: 'Editor: Toggle Comment',
  EditorSelectUp: 'Editor: Select Up',
  EditorSelectDown: 'Editor: Select Down',
  EditorToggleBlockComment: 'Editor: Toggle Block Comment',
  EditorOpenColorPicker: 'Editor: Open Color Picker',
  EditorCloseColorPicker: 'Editor: Close Color Picker',
  EditorCopyLineDown: 'Editor: Copy Line Down',
  EditorCopyLineUp: 'Editor: Copy Line Up',
  Replace: 'replace',
  NoResults: 'No Results',
  SortImports: 'Sort Imports',
}

export const goToDefinition = () => {
  return I18nString.i18nString(UiStrings.GoToDefinition)
}

export const goToTypeDefinition = () => {
  return I18nString.i18nString(UiStrings.GoToTypeDefinition)
}

export const findAllReferences = () => {
  return I18nString.i18nString(UiStrings.FindAllReferences)
}

export const findAllImplementations = () => {
  return I18nString.i18nString(UiStrings.FindAllImplementations)
}

export const cut = () => {
  return I18nString.i18nString(UiStrings.Cut)
}

export const copy = () => {
  return I18nString.i18nString(UiStrings.Copy)
}

export const paste = () => {
  return I18nString.i18nString(UiStrings.Paste)
}

export const undo = () => {
  return I18nString.i18nString(UiStrings.Undo)
}

export const redo = () => {
  return I18nString.i18nString(UiStrings.Redo)
}

export const toggleLineComment = () => {
  return I18nString.i18nString(UiStrings.ToggleLineComment)
}

export const toggleBlockComment = () => {
  return I18nString.i18nString(UiStrings.ToggleBlockComment)
}

export const selectAll = () => {
  return I18nString.i18nString(UiStrings.SelectAll)
}

export const copyLineUp = () => {
  return I18nString.i18nString(UiStrings.CopyLineUp)
}

export const copyLineDown = () => {
  return I18nString.i18nString(UiStrings.CopyLineDown)
}

export const moveLineUp = () => {
  return I18nString.i18nString(UiStrings.MoveLineUp)
}

export const moveLineDown = () => {
  return I18nString.i18nString(UiStrings.MoveLineDown)
}

export const formatDocument = () => {
  return I18nString.i18nString(UiStrings.FormatDocument)
}

export const sourceAction = () => {
  return I18nString.i18nString(UiStrings.SourceActions)
}
