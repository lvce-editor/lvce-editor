import * as Platform from '../Platform/Platform.js'
import * as SharedProcess from '../SharedProcess/SharedProcess.js'
import * as Workspace from '../Workspace/Workspace.js'

export const state = {
  count: 0,
  decorations: [],
  listeners: [],
}

export const onDidChangeCount = (listener) => {
  state.listeners.push(listener)
}

export const setCount = (count) => {
  state.count = count
  for (const listener of state.listeners) {
    listener()
  }
}

export const updateDecorations = () => {
  for (const listener of state.listeners) {
    listener()
  }
}

export const getBadgeCount = async () => {
  if (Platform.getPlatform() === 'web') {
    return 0
  }
  const workspacePath = Workspace.getWorkspacePath()
  const count = await SharedProcess.invoke(
    /* ExtensionHost.getSourceControlBadgeCount */ 'ExtensionHostSourceControl.getSourceControlBadgeCount',
    /* cwd */ workspacePath
  )
  return count
}
