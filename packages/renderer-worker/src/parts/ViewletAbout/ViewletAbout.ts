import * as AboutViewWorker from '../AboutViewWorker/AboutViewWorker.js'
import type { AboutState } from './ViewletAboutTypes.ts'

export const create = (id: number): AboutState => {
  return {
    id,
    commands: [],
  }
}

export const loadContent = async (state: AboutState): Promise<AboutState> => {
  await AboutViewWorker.invoke('About.create', state.id)
  await AboutViewWorker.invoke('About.loadContent2', state.id)
  const diffResult = await AboutViewWorker.invoke('About.diff2', state.id)
  const commands = await AboutViewWorker.invoke('About.render2', state.id, diffResult)
  return {
    ...state,
    commands,
  }
}
