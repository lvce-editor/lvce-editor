import * as PanelWorker from '../PanelWorker/PanelWorker.js'

export const wrapPanelCommand = (key: string) => {
  const fn = async (state, ...args) => {
    await PanelWorker.invoke(`Panel.${key}`, state.uid, ...args)
    const diffResult = await PanelWorker.invoke('Panel.diff2', state.uid)
    if (diffResult.length === 0) {
      return state
    }
    const commands = await PanelWorker.invoke('Panel.render2', state.uid, diffResult)
    if (commands.length === 0) {
      return state
    }
    return {
      ...state,
      commands,
    }
  }
  return fn
}
