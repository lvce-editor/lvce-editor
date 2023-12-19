export const splitGroupRight = (group) => {
  const { x, y, width, height } = group
  return [
    {
      x,
      y,
      width: width / 2,
      height,
    },
    {
      x: x + width / 2,
      y,
      width: width / 2,
      height: height,
    },
  ]
}
