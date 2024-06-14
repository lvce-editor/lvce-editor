export const state = {
  timeout: -1,
  x: 0,
  y: 0,
  editor: undefined,
}

export const get = () => {
  return state
}

export const set = (editor: any, timeout: any, x: number, y: number) => {
  state.editor = editor
  state.timeout = timeout
  state.x = x
  state.y = y
}
