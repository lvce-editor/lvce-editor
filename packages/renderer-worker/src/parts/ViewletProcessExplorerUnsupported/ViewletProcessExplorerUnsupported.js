const unsupportedMessage = 'Process Explorer is not supported on web.'

export const create = (id, uri, x, y, width, height) => {
  return {
    id,
    uid: id,
    uri,
    x,
    y,
    width,
    height,
    message: '',
  }
}

export const loadContent = (state) => {
  return {
    ...state,
    message: unsupportedMessage,
  }
}

export const getCommands = () => ({})

export const getKeyBindings = () => []

export const dispose = () => {}
