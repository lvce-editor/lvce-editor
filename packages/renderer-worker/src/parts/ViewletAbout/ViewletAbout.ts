import * as AboutViewWorker from '../AboutViewWorker/AboutViewWorker.js'
import type { AboutState } from './ViewletAboutTypes.ts'

export const create = (id: number): AboutState => {
  return {
    id,
    commands: [],
  }
}

export const loadContent = async (state: AboutState): Promise<AboutState> => {
  const { id } = state
  await AboutViewWorker.invoke('About.create', id)
  await AboutViewWorker.invoke('About.loadContent2', id)
  const diffResult = await AboutViewWorker.invoke('About.diff2', id)
  const commands = await AboutViewWorker.invoke('About.render2', id, diffResult)
  return {
    ...state,
    commands,
  }
}
