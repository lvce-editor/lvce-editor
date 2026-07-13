import * as AssetDir from '../AssetDir/AssetDir.js'
import * as Platform from '../Platform/Platform.js'
import * as RunningExtensionsViewWorker from '../RunningExtensionsViewWorker/RunningExtensionsViewWorker.ts'
import type { RunningExtensionsState } from './ViewletRunningExtensionsTypes.ts'

export const create = (uid: number, uri: string, x: number, y: number, width: number, height: number): RunningExtensionsState => {
  return {
    commands: [],
    height,
    title: 'Running Extensions',
    uid,
    uri,
    width,
    x,
    y,
  }
}

export const loadContent = async (state: RunningExtensionsState): Promise<RunningExtensionsState> => {
  const { height, uid, uri, width, x, y } = state
  await RunningExtensionsViewWorker.invoke('RunningExtensions.create', uid, uri, x, y, width, height, Platform.getPlatform(), AssetDir.assetDir)
  await RunningExtensionsViewWorker.invoke('RunningExtensions.loadContent', uid)
  const diffResult = await RunningExtensionsViewWorker.invoke('RunningExtensions.diff2', uid)
  const commands = await RunningExtensionsViewWorker.invoke('RunningExtensions.render2', uid, diffResult)
  return {
    ...state,
    commands,
  }
}

export const menus = []

export const getMenus = async () => {
  try {
    const ids = await RunningExtensionsViewWorker.invoke('RunningExtensions.getMenuEntryIds')
    return ids.map((id) => {
      return {
        id,
        async getMenuEntries(...args) {
          return RunningExtensionsViewWorker.invoke('RunningExtensions.getMenuEntries', ...args)
        },
      }
    })
  } catch {
    return []
  }
}
