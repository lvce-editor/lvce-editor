export const getMenuEntries = () => {
  return [
    {
      id: 'undo',
      label: 'Undo',
      flags: /* Disabled */ 5,
      command: /* TODO */ -1,
    },
    {
      id: 'redo',
      label: 'Redo',
      flags: /* Disabled */ 5,
      command: /* TODO */ -1,
    },
    {
      id: 'separator',
      label: '',
      flags: /* separator */ 1,
      command: /* TODO */ -1,
    },
    {
      id: 'cut',
      label: 'Cut',
      flags: /* None */ 0,
      command: /* EditorCut.editorCut */ 364,
    },
    {
      id: 'copy',
      label: 'Copy',
      flags: /* None */ 0,
      command: /* EditorCopy.editorCopy */ 365,
    },
    {
      id: 'paste',
      label: 'Paste',
      flags: /* None */ 0,
      command: /* EditorPaste.editorPaste */ 383,
    },
    {
      id: 'separator',
      label: '',
      flags: /* separator */ 1,
      command: /* TODO */ -1,
    },
    {
      id: 'toggle-line-comment',
      label: 'Toggle Line Comment',
      flags: /* None */ 0,
      command: /* EditorToggleLineComment.editorToggleLineComment */ 373,
    },
    {
      id: 'toggle-block-comment',
      label: 'Toggle Block Comment',
      flags: /* None */ 0,
      command: /* EditorToggleBlockComment.editorToggleBlockComment */ 362,
    },
  ]
}
