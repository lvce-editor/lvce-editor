import * as AboutViewWorker from '../AboutViewWorker/AboutViewWorker.js'

export const wrapAboutCommand = (key: string) => {
  const fn = async (state, ...args) => {
    const newState = await AboutViewWorker.invoke(`About.${key}`, state, ...args)
    const commands = await AboutViewWorker.invoke('About.render', state, newState)
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
