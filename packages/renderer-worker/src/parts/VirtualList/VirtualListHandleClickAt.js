import * as Viewlet from '../Viewlet/Viewlet.js'

const getIndex = (eventX, eventY, x, y, itemHeight) => {
  const relativeY = eventY - y
  const index = Math.floor(relativeY / itemHeight)
  return index
}

export const handleClickAt = async (state, eventX, eventY) => {
  const { x, y, itemHeight, uid } = state
  const index = getIndex(eventX, eventY, x, y, itemHeight)
  await Viewlet.executeViewletCommand(uid, 'selectIndex', index)
  console.log({ itemHeight, x, y, eventX, eventY, index })
  return state
}
