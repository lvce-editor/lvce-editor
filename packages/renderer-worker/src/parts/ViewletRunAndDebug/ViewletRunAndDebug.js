import * as Debug from '../Debug/Debug.js'

export const create = (id) => {
  return {
    id,
    disposed: false,
    processes: [],
  }
}

export const loadContent = async (state) => {
  const processes = await Debug.listProcesses()
  console.log({ processes })
  return {
    ...state,
    processes,
  }
}

// TODO make sure dispose is actually called
export const dispose = (state) => {
  return {
    ...state,
    disposed: true,
  }
}

export const hasFunctionalRender = true

export const hasFunctionalResize = true

export const render = []

export const resize = (state, dimensions) => {
  return { ...state, ...dimensions }
}
