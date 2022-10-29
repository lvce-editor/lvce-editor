export const state = {
  backgroundTabs: Object.create(null),
}

export const add = (uri, props) => {
  state.backgroundTabs[uri] = props
}

export const has = (uri) => {
  return uri in state.backgroundTabs
}

export const get = (uri) => {
  return state.backgroundTabs[uri]
}
