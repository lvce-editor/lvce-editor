import * as SharedProcess from '../SharedProcess/SharedProcess.js'
import * as GetTextSearchRipGrepArgs from '../GetTextSearchRipGrepArgs/GetTextSearchRipGrepArgs.js'

const state = {
  searches: Object.create(null),
}

export const start = (id, options) => {
  const emitter = new EventTarget()
  state.searches[id] = emitter
  const ripGrepArgs = GetTextSearchRipGrepArgs.getRipGrepArgs({
    ...options,
    searchString: options.query,
  })
  const actualOptions = {
    ripGrepArgs,
    searchDir: options.root,
  }
  SharedProcess.invoke('IncrementalTextSearch.start', id, actualOptions)
  return emitter
}

export const handleResult = (id, result) => {
  const search = state.searches[id]
  if (!search) {
    return
  }
  search.dispatchEvent(new Event('result', result))
}

export const handleFinished = (id) => {
  const search = state.searches[id]
  if (!search) {
    return
  }
  search.dispatchEvent(new Event('finished'))
  delete state.searches[id]
}

export const handleExit = (id) => {
  const search = state.searches[id]
  if (!search) {
    return
  }
  search.dispatchEvent(new Event('exit'))
  delete state.searches[id]
}

class RawDataEvent extends Event {
  constructor(data) {
    super('data')
    this.data = data
  }
}

export const handleData = (id, data) => {
  const search = state.searches[id]
  if (!search) {
    return
  }
  search.dispatchEvent(new RawDataEvent(data))
  delete state.searches[id]
}

export const handleCanceled = (id) => {
  const search = state.searches[id]
  if (!search) {
    return
  }
  search.dispatchEvent(new Event('canceled'))
  delete state.searches[id]
}

export const handleError = (id, error) => {
  const search = state.searches[id]
  if (!search) {
    return
  }
  search.dispatchEvent(new Event('error', {}))
}
