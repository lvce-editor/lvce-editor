import * as ProblemsWorker from '../ProblemsWorker/ProblemsWorker.ts'

export const hasFunctionalResize = true

export const resizeWithDependencies = async (state, dimensions, invoke) => {
  const { uid } = state
  await invoke('Problems.resize', uid, dimensions)
  const diffResult = await invoke('Problems.diff2', uid)
  const commands = await invoke('Problems.render2', uid, diffResult)
  return {
    ...state,
    ...dimensions,
    commands,
  }
}

export const resize = (state, dimensions) => {
  return resizeWithDependencies(state, dimensions, ProblemsWorker.invoke)
}
