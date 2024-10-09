import * as GetStorageViewVirtualDom from '../GetStorageViewVirtualDom/GetStorageViewVirtualDom.js'

const toRow = ([key, value]) => {
  return {
    key,
    value,
  }
}

const getRows = (storage) => {
  return Object.entries(storage).map(toRow)
}

const renderStorage = {
  isEqual(oldState, newState) {
    return oldState.localStorage === newState.localStorage && oldState.sessionStorage === newState.sessionStorage
  },
  apply(oldState, newState) {
    const rows = getRows(newState.localStorage)
    const dom = GetStorageViewVirtualDom.getStorageViewDom(rows)
    return ['Viewlet.setDom2', dom]
  },
}

export const hasFunctionalRender = true

export const hasFunctionalRootRender = true

export const render = [renderStorage]
