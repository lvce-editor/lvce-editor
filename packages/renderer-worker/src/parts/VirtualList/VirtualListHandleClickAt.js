import * as Viewlet from '../Viewlet/Viewlet.js'

const getIndex = (eventX, eventY, x, y, deltaY, itemHeight) => {
  const relativeY = eventY - y + deltaY
  const index = Math.floor(relativeY / itemHeight)
  return index
}

export const handleClickAt = async (state, eventX, eventY) => {
  const { x, y, itemHeight, uid, deltaY } = state
  const index = getIndex(eventX, eventY, x, y, deltaY, itemHeight)
  await Viewlet.executeViewletCommand(uid, 'selectIndex', index)
  return state
}
