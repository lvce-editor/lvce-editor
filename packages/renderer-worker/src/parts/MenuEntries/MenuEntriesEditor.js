export const getMenuEntries = () => {
  return [
    {
      id: 'go-to-type-definition',
      label: 'Go To Type Definition',
      flags: /* None */ 0,
      command: /* EditorCommandGoToTypeDefinition.editorGoToTypeDefinition */ 990,
    },
    {
      id: 'find-all-references',
      label: 'Find all references',
      flags: /* None */ 0,
      command: /* ViewletSideBar.show */ 554,
      args: [/* id */ 'References', /* focus */ true],
    },
    {
      id: 'find-all-implementations',
      label: 'Find all implementations',
      flags: /* None */ 0,
      command: /* ViewletSideBar.show */ 554,
      args: [/* id */ 'Implementations', /* focus */ true],
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
  ]
}
