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
      command: /* Editor.cut */ 'Editor.cut',
    },
    {
      id: 'copy',
      label: 'Copy',
      flags: /* None */ 0,
      command: /* Editor.copy */ 'Editor.copy',
    },
    {
      id: 'paste',
      label: 'Paste',
      flags: /* None */ 0,
      command: /* Editor.paste */ 'Editor.paste',
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
      command: /* Editor.toggleLineComment */ 'Editor.toggleLineComment',
    },
    {
      id: 'toggle-block-comment',
      label: 'Toggle Block Comment',
      flags: /* None */ 0,
      command: /* Editor.toggleBlockComment */ 'Editor.toggleBlockComment',
    },
  ]
}
