import * as GetBrowserViewOverviewVirtualDom from '../GetBrowserViewOverviewVirtualDom/GetBrowserViewOverviewVirtualDom.js'

export const hasFunctionalRender = true

const renderOverview = {
  isEqual(oldState, newState) {
    return oldState.browserViewMap === newState.browserViewMap
  },
  apply(oldState, newState) {
    const browserViewString = JSON.stringify(newState.browserViewMap, null, 2)
    const dom = GetBrowserViewOverviewVirtualDom.getDom(browserViewString)
    return ['setDom', dom]
  },
}

export const render = [renderOverview]
