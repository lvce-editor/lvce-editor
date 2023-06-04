import * as Height from '../Height/Height.js'
import * as VirtualList from '../VirtualList/VirtualList.js'

export const create = (id, uri, x, y, width, height) => {
  return {
    uid: id,
    id,
    x: 0,
    y: 0,
    width: 250,
    height: 150,
    maxHeight: 150,
  }
}

// TODO request hover information from extensions

export const loadContent = (state) => {
  return state
}
