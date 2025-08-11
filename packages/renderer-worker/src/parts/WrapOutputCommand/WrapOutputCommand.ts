import * as OutputViewWorker from '../OutputViewWorker/OutputViewWorker.js'

export const wrapOutputCommand = (key: string) => {
  const fn = async (state, ...args) => {
    await OutputViewWorker.invoke(`Output.${key}`, state.id, ...args)
    const diffResult = await OutputViewWorker.invoke(`Output.diff2`, state.id)
    const commands = await OutputViewWorker.invoke('Output.render2', state.id, diffResult)
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
