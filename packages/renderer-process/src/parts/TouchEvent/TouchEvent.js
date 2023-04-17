const toSimpleTouch = (touch) => {
  return {
    x: touch.clientX,
    y: touch.clientY,
    identifier: touch.identifier,
  }
}

const toSimpleTouches = (touches) => {
  return Array.from(touches).map(toSimpleTouch)
}

/**
 * @param {TouchEvent} event
 */
export const toSimpleTouchEvent = (event) => {
  const touches = toSimpleTouches(event.touches)
  const changedTouches = toSimpleTouches(event.changedTouches)
  return {
    touches,
    changedTouches,
  }
}
