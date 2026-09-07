import * as ElectronWebContentsViewFunctions from '../ElectronWebContentsViewFunctions/ElectronWebContentsViewFunctions.js'
import * as OpenBackgroundTab from './ViewletSimpleBrowserOpenBackgroundTab.js'

const actions = {
  backward: ElectronWebContentsViewFunctions.backward,
  forward: ElectronWebContentsViewFunctions.forward,
  reload: ElectronWebContentsViewFunctions.reload,
  inspectElement: ElectronWebContentsViewFunctions.inspectElement,
  copyImage: ElectronWebContentsViewFunctions.copyImageAt,
  toggleDevTools: ElectronWebContentsViewFunctions.toggleDevTools,
}

export const handleContextMenuAction = async (state, browserViewId, action, args = []) => {
  if (!state.tabs.some((tab) => tab.browserViewId === browserViewId)) return state
  if (action === 'openBackgroundTab') return OpenBackgroundTab.openBackgroundTab(state, args[0])
  if (!Object.hasOwn(actions, action)) return state
  await actions[action](browserViewId, ...args)
  return state
}
