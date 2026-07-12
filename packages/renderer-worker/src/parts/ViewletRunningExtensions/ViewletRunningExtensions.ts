import type { RunningExtensionsState } from './ViewletRunningExtensionsTypes.ts'
import * as RunningExtensionsViewWorker from '../RunningExtensionsViewWorker/RunningExtensionsViewWorker.js'

export const create = (id: number, uri: string, x: number, y: number, width: number, height: number): RunningExtensionsState => {
  return {
    commands: [],
    height,
    id,
    width,
    x,
    y,
  }
}

export const loadContent = async (state: RunningExtensionsState): Promise<RunningExtensionsState> => {
  const { height, id, width, x, y } = state
  await RunningExtensionsViewWorker.invoke('RunningExtensions.create', id, '', x, y, width, height)
  await RunningExtensionsViewWorker.invoke('RunningExtensions.loadContent', id)
  const diffResult = await RunningExtensionsViewWorker.invoke('RunningExtensions.diff2', id)
  const commands = await RunningExtensionsViewWorker.invoke('RunningExtensions.render2', id, diffResult)
  return {
    ...state,
    commands,
  }
}
