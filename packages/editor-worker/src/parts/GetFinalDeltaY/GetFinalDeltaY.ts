export const getFinalDeltaY = (height: number, itemHeight: number, itemsLength: number) => {
  const contentHeight = itemsLength * itemHeight
  // @ts-ignore
  const numberOfVisible = Math.ceil(height / itemHeight)
  const finalDeltaY = Math.max(contentHeight - height, 0)
  return finalDeltaY
}
