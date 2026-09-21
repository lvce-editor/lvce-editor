import * as SourceControlWorker from '../SourceControlWorker/SourceControlWorker.js'

export const hasFunctionalResize = true

export const resizeWithDependencies = async (state, dimensions, invoke) => {
  await invoke('SourceControl.handleResize', state.uid, dimensions)
  const diff = await invoke('SourceControl.diff2', state.uid)
  if (diff.length === 0) {
    return state
  }
  const commands = await invoke('SourceControl.render2', state.uid, diff)
  return { ...state, ...dimensions, commands }
}

export const resize = (state, dimensions) => {
  return resizeWithDependencies(state, dimensions, SourceControlWorker.invoke)
}
