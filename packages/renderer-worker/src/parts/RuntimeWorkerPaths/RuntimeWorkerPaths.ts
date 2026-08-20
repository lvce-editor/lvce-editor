const state: { paths: Readonly<Record<string, string>> } = {
  paths: {},
}

export const initialize = (paths: Readonly<Record<string, string>> = {}): void => {
  state.paths = paths
}

export const get = (key: string): string => {
  return state.paths[key] || ''
}
