import * as SettingsViewWorker from '../SettingsViewWorker/SettingsViewWorker.js'
import * as ViewletStates from '../ViewletStates/ViewletStates.js'
import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'
import * as NameAnonymousFunction from '../NameAnonymousFunction/NameAnonymousFunction.js'

export const wrapSettingsCommand = (key: string) => {
  const fn = async (state, ...args) => {
    await SettingsViewWorker.invoke(`Settings.${key}`, state.uid, ...args)
    const diffResult = await SettingsViewWorker.invoke('Settings.diff2', state.uid)
    if (diffResult.length === 0) {
      return state
    }
    const commands = await SettingsViewWorker.invoke('Settings.render2', state.uid, diffResult)
    const actionsDom = await SettingsViewWorker.invoke('Settings.renderActions', state.uid)
    if (commands.length === 0) {
      return state
    }
    const latest = ViewletStates.getState(ViewletModuleId.Settings)
    return {
      ...latest,
      commands,
      actionsDom,
    }
  }
  NameAnonymousFunction.nameAnonymousFunction(fn, `Settings/${key}`)
  return fn
}
