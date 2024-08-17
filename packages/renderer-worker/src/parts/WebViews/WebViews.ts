interface State {
  webViews: readonly any[]
}

const state: State = {
  webViews: [],
}

export const add = (webView: any) => {
  state.webViews = [...state.webViews, webView]
}

export const addMany = (webViews: any[]) => {
  state.webViews = [...state.webViews, ...webViews]
}

export const get = () => {
  return state.webViews
}
