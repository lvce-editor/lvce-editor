/**
 * @enum {string}
 */
const UiStrings = {
  File: 'File',
  Edit: 'Edit',
  Selection: 'Selection',
  View: 'View',
  Go: 'Go',
  Run: 'Run',
  Terminal: 'Terminal',
  Window: 'Window',
  Help: 'Help',
}

export const getTitleBarItems = () => {
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
