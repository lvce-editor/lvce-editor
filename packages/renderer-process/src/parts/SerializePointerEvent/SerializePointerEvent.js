export const serializePointerEvent = (event) => {
  const { button, clientX, clientY } = event
  return {
    button,
    clientX,
    clientY,
  }
}
