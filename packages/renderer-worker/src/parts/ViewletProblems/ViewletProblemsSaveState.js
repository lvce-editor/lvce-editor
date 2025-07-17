import * as ProblemsWorker from '../ProblemsWorker/ProblemsWorker.ts'

export const saveState = async (state) => {
  const savedState = await ProblemsWorker.invoke('Problems.saveState', state.uid)
  return savedState
}
