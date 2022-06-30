export const getMenuEntries = () => {
  return [
    {
      id: 'go-to-type-definition',
      label: 'Go To Type Definition',
      flags: /* None */ 0,
      command: /* Editor.goToTypeDefinition */ 'Editor.goToTypeDefinition',
    },
    {
      id: 'find-all-references',
      label: 'Find all references',
      flags: /* None */ 0,
      command: /* ViewletSideBar.show */ 'SideBar.show',
      args: [/* id */ 'References', /* focus */ true],
    },
    {
      id: 'find-all-implementations',
      label: 'Find all implementations',
      flags: /* None */ 0,
      command: /* ViewletSideBar.show */ 'SideBar.show',
      args: [/* id */ 'Implementations', /* focus */ true],
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
  ]
}
