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
  const handlePaused = () => {
    // TODO
  }
  const handleResumed = () => {
    // TODO
  }

  Debug.addEventListener('paused', handlePaused)
  Debug.addEventListener('resumed', handleResumed)
  return {
    ...state,
    processes,
  }
}

export const continue_ = async (state) => {
  await Debug.continue_()
  console.log('continue')
  return state
}

export const pause = async (state) => {
  await Debug.pause()
  console.log('pause')
  return state
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

const renderProcesses = {
  isEqual(oldState, newState) {
    return oldState.processes === newState.processes
  },
  apply(oldState, newState) {
    return [/* method */ 'setProcesses', /* processes */ newState.processes]
  },
}

export const render = [renderProcesses]

export const resize = (state, dimensions) => {
  return { ...state, ...dimensions }
}
