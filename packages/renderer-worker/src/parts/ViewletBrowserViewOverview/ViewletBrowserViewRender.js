import * as GetBrowserViewOverviewVirtualDom from '../GetBrowserViewOverviewVirtualDom/GetBrowserViewOverviewVirtualDom.js'

export const hasFunctionalRender = true

const renderOverview = {
  isEqual(oldState, newState) {
    console.log({ eq: oldState.browserViewMap === newState.browserViewMap, nb: newState.browserViewMap })
    return oldState.browserViewMap === newState.browserViewMap
  },
  apply(oldState, newState) {
    const browserViewString = JSON.stringify(newState.browserViewMap, null, 2)
    const dom = GetBrowserViewOverviewVirtualDom.getDom(browserViewString)
    console.log({ dom })
    return ['setDom', dom]
  },
}

export const render = [renderOverview]
