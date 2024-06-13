import * as I18nString from '../I18NString/I18NString.ts'

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
}

export const goToDefinition = () => {
  return I18nString.i18nString(UiStrings.GoToDefinition)
}

export const organizeImports = () => {
  return I18nString.i18nString(UiStrings.OrganizeImports)
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

export const separator = () => {
  return ''
}

export const noDefinitionFound = () => {
  return I18nString.i18nString(UiStrings.NoDefinitionFound)
}

// @ts-ignore
export const noDefinitionFoundFor = (word) => {
  return I18nString.i18nString(UiStrings.NoDefinitionFoundFor, {
    PH1: word,
  })
}

// @ts-ignore
export const noTypeDefinitionFoundFor = (word) => {
  return I18nString.i18nString(UiStrings.NoTypeDefinitionFoundFor, {
    PH1: word,
  })
}

export const noTypeDefinitionFound = () => {
  return I18nString.i18nString(UiStrings.NoTypeDefinitionFound)
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

export const duplicateSelection = () => {
  return I18nString.i18nString(UiStrings.DuplicateSelection)
}

export const formatDocument = () => {
  return I18nString.i18nString(UiStrings.FormatDocument)
}

export const sourceAction = () => {
  return I18nString.i18nString(UiStrings.SourceActions)
}

export const editorShowHover = () => {
  return I18nString.i18nString(UiStrings.EditorShowHover)
}

export const editorFormatDocumentForced = () => {
  return I18nString.i18nString(UiStrings.EditorFormatDocumentForced)
}

export const editorSelectNextOccurrence = () => {
  return I18nString.i18nString(UiStrings.EditorSelectNextOccurrence)
}

export const editorSelectAllOccurrences = () => {
  return I18nString.i18nString(UiStrings.EditorSelectAllOccurrences)
}

export const editorGoToDefinition = () => {
  return I18nString.i18nString(UiStrings.EditorGoToDefinition)
}

export const editorGoToTypeDefinition = () => {
  return I18nString.i18nString(UiStrings.EditorGoToTypeDefinition)
}

export const editorSelectInsideString = () => {
  return I18nString.i18nString(UiStrings.EditorSelectInsideString)
}

export const editorIndent = () => {
  return I18nString.i18nString(UiStrings.EditorIndent)
}

export const editorUnindent = () => {
  return I18nString.i18nString(UiStrings.EditorUnindent)
}

export const editorSortLinesAscending = () => {
  return I18nString.i18nString(UiStrings.EditorSortLinesAscending)
}

export const editorToggleComment = () => {
  return I18nString.i18nString(UiStrings.EditorToggleComment)
}

export const editorSelectUp = () => {
  return I18nString.i18nString(UiStrings.EditorSelectUp)
}

export const editorSelectDown = () => {
  return I18nString.i18nString(UiStrings.EditorSelectDown)
}

export const editorToggleBlockComment = () => {
  return I18nString.i18nString(UiStrings.EditorToggleBlockComment)
}

export const editorOpenColorPicker = () => {
  return I18nString.i18nString(UiStrings.EditorOpenColorPicker)
}

export const editorCloseColorPicker = () => {
  return I18nString.i18nString(UiStrings.EditorCloseColorPicker)
}

export const editorCopyLineDown = () => {
  return I18nString.i18nString(UiStrings.EditorCopyLineDown)
}

export const editorCopyLineUp = () => {
  return I18nString.i18nString(UiStrings.EditorCopyLineUp)
}

export const replace = () => {
  return I18nString.i18nString(UiStrings.Replace)
}
