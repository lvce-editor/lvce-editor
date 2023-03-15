import * as Command from '../Command/Command.js'

const getIndex = (eventX, eventY, x, y, itemHeight) => {
  const relativeY = eventY - y
  const index = Math.floor(relativeY / itemHeight)
  return index
}

export const handleClickAt = async (state, eventX, eventY) => {
  const { x, y, itemHeight, id } = state
  const index = getIndex(eventX, eventY, x, y, itemHeight)
  const selectCommand = `${id}.selectIndex`
  await Command.execute(selectCommand, index)
  console.log({ itemHeight, x, y, eventX, eventY, index })
  return state
}
