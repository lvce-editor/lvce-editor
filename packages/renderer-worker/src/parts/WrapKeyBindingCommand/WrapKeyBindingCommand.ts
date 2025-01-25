import * as KeyBindingsViewWorker from '../KeyBindingsViewWorker/KeyBindingsViewWorker.js'

export const wrapKeyBindingCommand = (key: string) => {
  const fn = async (state, ...args) => {
    await KeyBindingsViewWorker.invoke(`KeyBindings.${key}`, state.uid, ...args)
    const commands = await KeyBindingsViewWorker.invoke('KeyBindings.render2', state.uid)
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
