export const getQuickPickMenuEntries = () => {
  return [
    {
      id: 'Editor.format',
      label: 'Editor: Format Document',
    },
    {
      id: 'Editor.showHover',
      label: 'Editor: Show Hover',
    },
    {
      id: 'Editor.formatForced',
      label: 'Editor: Format Document (forced)',
    },
    {
      id: 'Editor.selectNextOccurrence',
      label: 'Editor: Select Next Occurrence',
    },
    {
      id: 'Editor.selectAllOccurrences',
      label: 'Editor: Select All Occurrences',
    },
    {
      id: 'Editor.goToDefinition',
      label: 'Editor: Go To Definition',
    },
    {
      id: 'Editor.goToTypeDefinition',
      label: 'Editor: Go To Type Definition',
    },
    {
      id: 'Editor.selectInsideString',
      label: 'Editor: Select Inside String',
    },
    {
      id: 'Editor.indent',
      label: 'Editor: Indent',
      aliases: ['Indent More', 'DeIndent'],
    },
    {
      id: 'Editor.unindent',
      label: 'Editor: Unindent',
      aliases: ['Indent Less', 'DeIndent'],
    },
    {
      id: 'Editor.sortLinesAscending',
      label: 'Editor: Sort Lines Ascending',
    },
    {
      id: 'Editor.toggleComment',
      label: 'Editor: Toggle Comment',
    },
    {
      id: 'Editor.selectUp',
      label: 'Editor: Select Up',
    },
    {
      id: 'Editor.selectDown',
      label: 'Editor: Select Down',
    },
    {
      id: 'Editor.toggleBlockComment',
      label: 'Editor: Toggle Block Comment',
    },
    {
      id: 'Editor.openColorPicker',
      label: 'Editor: Open Color Picker',
    },
    {
      id: 'Editor.closeColorPicker',
      label: 'Editor: Close Color Picker',
    },
    {
      id: 'Editor.copyLineDown',
      label: 'Editor: Copy Line Down',
    },
    {
      id: 'Editor.copyLineUp',
      label: 'Editor: Copy Line Up',
    },
    {
      id: 'Editor.moveLineDown',
      label: 'Editor: Move Line Down',
    },
    {
      id: 'Editor.moveLineUp',
      label: 'Editor: Move Line Up',
    },
  ]
}
