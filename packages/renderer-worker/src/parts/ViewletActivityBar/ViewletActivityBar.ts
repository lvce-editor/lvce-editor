import * as ActivityBarWorker from '../ActivityBarWorker/ActivityBarWorker.js'
import * as Height from '../Height/Height.js'
import type { ActivityBarState } from './ActivityBarState.ts'

// TODO rename viewlet parameter to something else (e.g. clicking settings opens context menu not settings viewlet)
// TODO should just pass index
// then if item is viewlet -> open viewlet
// else if item is settings -> open settings

// TODO this should be create
// TODO unregister listeners when hidden

export const create = (id, uri, x, y, width, height): ActivityBarState => {
  return {
    uid: id,
    // TODO declarative event api is good, but need to bind
    // listeners to state somehow
    // also the use of global event bus is not good
    // and this api is not strongly typed
    events: {
      'SourceControl.changeBadgeCount': 8012,
      'Layout.hideSideBar': 8014,
      'SideBar.viewletChange': 8013,
    },
    activityBarItems: [],
    filteredItems: [],
    focusedIndex: -1,
    selectedIndex: -1,
    focused: false,
    x,
    y,
    width,
    height,
    itemHeight: Height.ActivityBarItem,
    commands: [],
  }
}

export const loadContent = async (state: ActivityBarState): Promise<ActivityBarState> => {
  const savedState = {}
  await ActivityBarWorker.invoke('ActivityBar.create', state.uid, '', state.x, state.y, state.width, state.height, null)
  await ActivityBarWorker.invoke('ActivityBar.loadContent', state.uid, savedState)
  const diffResult = await ActivityBarWorker.invoke('ActivityBar.diff2', state.uid)
  const commands = await ActivityBarWorker.invoke('ActivityBar.render2', state.uid, diffResult)
  return {
    ...state,
    commands,
  }
}
