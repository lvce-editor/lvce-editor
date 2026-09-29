import * as SourceControlWorker from '../SourceControlWorker/SourceControlWorker.js'
import * as Command from '../Command/Command.js'
import * as ViewletStates from '../ViewletStates/ViewletStates.js'
import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'

export const renderPendingSourceControl = async (state) => {
  const [diffResult, actionsDom] = await Promise.all([
    SourceControlWorker.invoke('SourceControl.diff2', state.uid),
    SourceControlWorker.invoke('SourceControl.renderActions', state.uid),
  ])
  const updatedState = {
    ...state,
    actionsDom,
    commands: [],
  }
  if (diffResult.length === 0) {
    return updatedState
  }
  const commands = await SourceControlWorker.invoke('SourceControl.render2', state.uid, diffResult)
  const badgeCount = await SourceControlWorker.invoke('SourceControl.getBadgeCount', state.uid, diffResult)
  if (commands.length === 0) {
    return updatedState
  }
  if (state.badgeCount !== badgeCount) {
    const newState = {
      ...updatedState,
      commands,
      badgeCount,
    }

    ViewletStates.setState(state.uid, newState)
    ViewletStates.setRenderedState(state.uid, newState)
    await Command.execute('Layout.setBadgeCount', ViewletModuleId.SourceControl, badgeCount)
  }
  return {
    ...updatedState,
    commands,
    badgeCount,
  }
}

export const wrapSourceControlCommand = (key: string) => {
  const fn = async (state, ...args) => {
    await SourceControlWorker.invoke(`SourceControl.${key}`, state.uid, ...args)
    return renderPendingSourceControl(state)
  }
  return fn
}
