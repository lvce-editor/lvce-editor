import * as ViewletSourceControl from './ViewletSourceControl.js'

export const Events = {
  'workspace.change': ViewletSourceControl.handleWorkspaceChange,
}

export * from './ViewletSourceControl.js'
export * from './ViewletSourceControlCommands.js'
export * from './ViewletSourceControlCss.js'
export * from './ViewletSourceControlMenuEntries.js'
export * from './ViewletSourceControlName.js'
export * from './ViewletSourceControlRender.js'
export * from './ViewletSourceControlRenderActions.js'
export * from './ViewletSourceControlResize.js'
export * from './ViewletSourceControlKeyBindings.js'
