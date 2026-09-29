import * as Command from '../Command/Command.js'
import * as Viewlet from '../Viewlet/Viewlet.js'

interface ViewletState {
  readonly currentViewletId?: string
  readonly parentUid?: number
  readonly uid: number
}

interface RevealInExplorerDependencies {
  readonly executeCommand: (command: string, ...args: readonly unknown[]) => Promise<unknown>
  readonly executeViewletCommand: (uid: number, command: string, ...args: readonly unknown[]) => Promise<void>
  readonly getAllStates: () => Record<string, ViewletState>
}

const defaultDependencies: RevealInExplorerDependencies = {
  executeCommand: Command.execute,
  executeViewletCommand: Viewlet.executeViewletCommand,
  getAllStates: Viewlet.getAllStates,
}

export const revealInExplorerWithDependencies = async (uri: string, dependencies: RevealInExplorerDependencies): Promise<void> => {
  const { executeCommand, executeViewletCommand, getAllStates } = dependencies
  await executeCommand('Layout.showSideBar', 'Explorer')
  const states = Object.values(getAllStates())
  const sideBar = states.find((state) => state.currentViewletId === 'Explorer')
  if (!sideBar) {
    throw new Error('Explorer sidebar not found')
  }
  const explorerUids = states.filter((state) => state.parentUid === sideBar.uid).map((state) => state.uid)
  if (explorerUids.length === 0) {
    throw new Error('Explorer view not found')
  }
  const explorerUid = Math.max(...explorerUids)
  await executeViewletCommand(explorerUid, 'revealItem', uri)
}

export const revealInExplorer = async (uri: string): Promise<void> => {
  await revealInExplorerWithDependencies(uri, defaultDependencies)
}
