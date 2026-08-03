import * as NameAnonymousFunction from '../NameAnonymousFunction/NameAnonymousFunction.js'
import * as ProblemsWorker from '../ProblemsWorker/ProblemsWorker.ts'
import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'
import * as ViewletStates from '../ViewletStates/ViewletStates.js'

interface ProblemsCommandDependencies {
  readonly getState: () => ProblemsViewState
  readonly invoke: (command: string, ...args: readonly unknown[]) => Promise<unknown>
}

interface ProblemsViewState {
  readonly actionsDom?: readonly unknown[]
  readonly [key: string]: unknown
  readonly uid: number
}

type ProblemsCommand = (state: ProblemsViewState, ...args: readonly unknown[]) => Promise<ProblemsViewState>

const defaultDependencies: ProblemsCommandDependencies = {
  getState: () => ViewletStates.getState(ViewletModuleId.Problems) as ProblemsViewState,
  invoke: ProblemsWorker.invoke,
}

const areActionsEqual = (oldActionsDom: readonly unknown[] | undefined, newActionsDom: readonly unknown[]): boolean => {
  return JSON.stringify(oldActionsDom) === JSON.stringify(newActionsDom)
}

export const wrapProblemsCommandWithDependencies = (key: string, dependencies: ProblemsCommandDependencies): ProblemsCommand => {
  const { getState, invoke } = dependencies
  const fn: ProblemsCommand = async (state, ...args) => {
    const { actionsDom: oldActionsDom, uid } = state
    await invoke(`Problems.${key}`, uid, ...args)
    const diffResult = (await invoke('Problems.diff2', uid)) as readonly unknown[]
    const actionsDom = (await invoke('Problems.renderActions', uid)) as readonly unknown[]
    const actionsChanged = !areActionsEqual(oldActionsDom, actionsDom)
    if (diffResult.length === 0 && !actionsChanged) {
      return state
    }
    const commands = diffResult.length === 0 ? [] : ((await invoke('Problems.render2', uid, diffResult)) as readonly unknown[])
    if (commands.length === 0 && !actionsChanged) {
      return state
    }
    const latest = getState()
    return {
      ...latest,
      actionsDom,
      commands,
    }
  }
  NameAnonymousFunction.nameAnonymousFunction(fn, `Problems/${key}`)
  return fn
}

export const wrapProblemsCommand = (key: string): ProblemsCommand => {
  return wrapProblemsCommandWithDependencies(key, defaultDependencies)
}
