import * as KeyBindingsViewWorker from '../KeyBindingsViewWorker/KeyBindingsViewWorker.js'

export const wrapKeyBindingCommand = (key: string) => {
  const fn = async (state, ...args) => {
    await KeyBindingsViewWorker.invoke(`KeyBindings.${key}`, state.uid, ...args)
    const diffResult = await KeyBindingsViewWorker.invoke('KeyBindings.diff2', state.uid)
    const commands = await KeyBindingsViewWorker.invoke('KeyBindings.render3', state.uid, diffResult)
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
