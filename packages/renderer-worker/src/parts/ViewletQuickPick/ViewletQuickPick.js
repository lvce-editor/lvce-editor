import * as FileSearchWorker from '../FileSearchWorker/FileSearchWorker.js'
import * as Height from '../Height/Height.js'
import * as InputSource from '../InputSource/InputSource.js'
import * as MinimumSliderSize from '../MinimumSliderSize/MinimumSliderSize.js'
import * as Platform from '../Platform/Platform.js'
import * as QuickPickEveryThing from '../QuickPickEntriesEverything/QuickPickEntriesEverything.js'
import * as VirtualList from '../VirtualList/VirtualList.js'
import * as Workspace from '../Workspace/Workspace.js'

// TODO send open signal to renderer process before items are ready
// that way user can already type while items are still loading

// TODO cache quick pick items -> don't send every time from renderer worker to renderer process
// maybe cache by id opening commands -> has all commands cached
// when filtering -> sends all indices (uint16Array) to renderer process instead of filtered/sorted command objects

// state:
// 1. default
// 2. creating (input is ready, but there are no items yet)
// 3. finished

const QuickPickState = {
  Default: 0,
  Creating: 1,
  Finished: 2,
}

export const create = (id, uri, x, y, width, height, args) => {
  return {
    uid: id,
    state: QuickPickState.Default,
    picks: [],
    recentPicks: [],
    recentPickIds: new Map(), // TODO use object.create(null) instead
    versionId: 0,
    provider: QuickPickEveryThing, // TODO make this dynamic again
    warned: [],
    visiblePicks: [],
    maxVisibleItems: 10,
    uri,
    cursorOffset: 0,
    height: 300,
    top: 50,
    width: 600,
    ...VirtualList.create({
      itemHeight: Height.ListItem,
      headerHeight: 30,
      minimumSliderSize: MinimumSliderSize.minimumSliderSize,
    }),
    inputSource: InputSource.User,
    args,
    focused: false,
    commands: [],
  }
}

export const loadContent = async (state) => {
  const { uri, args } = state
  const listItemHeight = 22
  const renderAllItems = true
  await FileSearchWorker.invoke(
    'QuickPick.create2',
    state.uid,
    uri,
    listItemHeight,
    state.x,
    state.y,
    state.width,
    state.height,
    Platform.platform,
    args,
    renderAllItems,
    Workspace.state.workspacePath,
  )
  await FileSearchWorker.invoke('QuickPick.loadContent', state.uid)
  const diffResult = await FileSearchWorker.invoke('QuickPick.diff2', state.uid)
  const commands = await FileSearchWorker.invoke('QuickPick.render2', state.uid, diffResult)

  return {
    ...state,
    commands,
  }
}

export const dispose = (state) => {
  return state
}
