import * as EditorStrings from '../EditorStrings/EditorStrings.js'

export const getQuickPickMenuEntries = () => {
  return [
    {
      id: 'Editor.format',
      label: EditorStrings.formatDocument(),
    },
    {
      id: 'Editor.showHover',
      label: EditorStrings.editorShowHover(),
    },
    {
      id: 'Editor.formatForced',
      label: EditorStrings.editorFormatDocumentForced(),
    },
    {
      id: 'Editor.selectNextOccurrence',
      label: EditorStrings.editorSelectNextOccurrence(),
    },
    {
      id: 'Editor.selectAllOccurrences',
      label: EditorStrings.editorSelectAllOccurrences(),
    },
    {
      id: 'Editor.goToDefinition',
      label: EditorStrings.editorGoToDefinition(),
    },
    {
      id: 'Editor.goToTypeDefinition',
      label: EditorStrings.editorGoToTypeDefinition(),
    },
    {
      id: 'Editor.selectInsideString',
      label: EditorStrings.editorSelectInsideString(),
    },
    {
      id: 'Editor.indent',
      label: EditorStrings.editorIndent(),
      aliases: ['Indent More', 'DeIndent'],
    },
    {
      id: 'Editor.unindent',
      label: EditorStrings.editorUnindent(),
      aliases: ['Indent Less', 'DeIndent'],
    },
    {
      id: 'Editor.sortLinesAscending',
      label: EditorStrings.editorSortLinesAscending(),
    },
    {
      id: 'Editor.toggleComment',
      label: EditorStrings.editorToggleComment(),
    },
    {
      id: 'Editor.selectUp',
      label: EditorStrings.editorSelectUp(),
    },
    {
      id: 'Editor.selectDown',
      label: EditorStrings.editorSelectDown(),
    },
    {
      id: 'Editor.toggleBlockComment',
      label: EditorStrings.toggleBlockComment(),
    },
    {
      id: 'Editor.openColorPicker',
      label: EditorStrings.editorOpenColorPicker(),
    },
    {
      id: 'Editor.closeColorPicker',
      label: EditorStrings.editorCloseColorPicker(),
    },
    {
      id: 'Editor.copyLineDown',
      label: EditorStrings.editorCopyLineDown(),
    },
    {
      id: 'Editor.copyLineUp',
      label: EditorStrings.editorCopyLineUp(),
    },
    {
      id: 'Editor.moveLineDown',
      label: EditorStrings.moveLineDown(),
    },
    {
      id: 'Editor.moveLineUp',
      label: EditorStrings.moveLineUp(),
    },
    {
      id: 'Editor.showSourceActions',
      label: EditorStrings.sourceAction(),
    },
  ]
}
