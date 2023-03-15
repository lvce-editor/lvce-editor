import * as ViewletExplorer from './ViewletExplorer.js'

export const name = 'Explorer'

export const Events = {
  'languages.changed': ViewletExplorer.handleLanguagesChanged,
  'workspace.change': ViewletExplorer.handleWorkspaceChange,
}

export * from './ViewletExplorer.js'
export * from './ViewletExplorerActions.js'
export * from './ViewletExplorerCommands.js'
export * from './ViewletExplorerCss.js'
export * from './ViewletExplorerKeyBindings.js'
