import * as ExplorerViewWorker from '../ExplorerViewWorker/ExplorerViewWorker.js'
import * as ViewletExplorer from '../ViewletExplorer/ViewletExplorer.js'

interface ExplorerCommandDependencies {
  readonly getTitle: (uid: number) => Promise<string>
  readonly invoke: (command: string, ...args: readonly unknown[]) => Promise<unknown>
}

interface ExplorerViewState {
  readonly actionsDom: readonly unknown[]
  readonly [key: string]: unknown
  readonly title: string
  readonly uid: number
}

type ExplorerCommand = (state: ExplorerViewState, ...args: readonly unknown[]) => Promise<ExplorerViewState>

const defaultDependencies: ExplorerCommandDependencies = {
  getTitle: ViewletExplorer.getTitle,
  invoke: ExplorerViewWorker.invoke,
}

const updateActionsAndTitle = (state: ExplorerViewState, actionsDom: readonly unknown[], title: string): ExplorerViewState => {
  const { actionsDom: oldActionsDom, title: oldTitle } = state
  if (oldTitle === title && JSON.stringify(oldActionsDom) === JSON.stringify(actionsDom)) {
    return state
  }
  return {
    ...state,
    actionsDom,
    title,
  }
}

export const wrapExplorerCommandWithDependencies = (key: string, dependencies: ExplorerCommandDependencies): ExplorerCommand => {
  const { getTitle, invoke } = dependencies
  const fn: ExplorerCommand = async (state, ...args) => {
    const { uid } = state
    await invoke(`Explorer.${key}`, uid, ...args)
    const diffResult = (await invoke('Explorer.diff2', uid)) as readonly unknown[]
    const title = await getTitle(uid)
    const actionsDom = (await invoke('Explorer.renderActions2', uid)) as readonly unknown[]
    const updatedState = updateActionsAndTitle(state, actionsDom, title)
    if (diffResult.length === 0) {
      return updatedState
    }
    const commands = (await invoke('Explorer.render2', uid, diffResult)) as readonly unknown[]
    if (commands.length === 0) {
      return updatedState
    }
    return {
      ...updatedState,
      commands,
    }
  }
  return fn
}

export const wrapExplorerCommand = (key: string): ExplorerCommand => {
  return wrapExplorerCommandWithDependencies(key, defaultDependencies)
}
