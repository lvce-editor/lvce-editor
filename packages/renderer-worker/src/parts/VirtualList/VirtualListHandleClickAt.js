import * as Viewlet from '../Viewlet/Viewlet.js'
import * as GetListIndex from '../GetListIndex/GetListIndex.js'

export const handleClickAt = async (state, eventX, eventY) => {
  const { x, y, itemHeight, uid, deltaY } = state
  const index = GetListIndex.getListIndex(eventX, eventY, x, y, deltaY, itemHeight)
  await Viewlet.executeViewletCommand(uid, 'selectIndex', index)
  return state
}
