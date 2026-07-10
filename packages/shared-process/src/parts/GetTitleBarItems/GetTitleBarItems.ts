/**
 * @enum {string}
 */
const UiStrings = {
  Edit: 'Edit',
  File: 'File',
  Go: 'Go',
  Help: 'Help',
  Run: 'Run',
  Selection: 'Selection',
  Terminal: 'Terminal',
  View: 'View',
  Window: 'Window',
}

export const getTitleBarItems = (): any => {
  return [
    {
      label: UiStrings.File,
    },
    {
      label: UiStrings.Edit,
    },
    {
      label: UiStrings.Selection,
    },
    {
      label: UiStrings.View,
    },
    {
      label: UiStrings.Go,
    },
    {
      label: UiStrings.Run,
    },
    {
      label: UiStrings.Terminal,
    },
    {
      label: UiStrings.Window,
    },
    {
      label: UiStrings.Help,
    },
  ]
}
