import * as TitleBarWorker from '../TitleBarWorker/TitleBarWorker.js'

export const hasFunctionalResize = true

export const resize = async (state, dimensions) => {
  await TitleBarWorker.invoke('TitleBar.resize', state.uid, dimensions)
  const diffResult = await TitleBarWorker.invoke('TitleBar.diff3', state.uid)
  const commands = await TitleBarWorker.invoke('TitleBar.render3', state.uid, diffResult)
  return {
    ...state,
    commands,
  }
}
