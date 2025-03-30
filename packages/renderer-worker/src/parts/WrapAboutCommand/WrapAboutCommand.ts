import * as AboutViewWorker from '../AboutViewWorker/AboutViewWorker.js'

export const wrapAboutCommand = (key: string) => {
  const fn = async (state, ...args) => {
    await AboutViewWorker.invoke(`About.${key}`, state.id, ...args)
    const diffResult = await AboutViewWorker.invoke(`About.diff2`, state.id)
    const commands = await AboutViewWorker.invoke('About.render2', state.id, diffResult)
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
