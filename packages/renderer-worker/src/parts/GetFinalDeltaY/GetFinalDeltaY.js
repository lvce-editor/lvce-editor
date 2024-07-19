export const getFinalDeltaY = (height, itemHeight, itemsLength) => {
  const contentHeight = itemsLength * itemHeight
  // @ts-ignore
  const numberOfVisible = Math.ceil(height / itemHeight)
  const finalDeltaY = Math.max(contentHeight - height, 0)
  return finalDeltaY
}
