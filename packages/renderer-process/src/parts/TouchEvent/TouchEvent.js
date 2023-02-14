const toSimpleTouch = (touch) => {
  return {
    x: touch.clientX,
    y: touch.clientY,
  }
}

export const toSimpleTouchEvent = (event) => {
  const touches = Array.from(event.touches).map(toSimpleTouch)
  const changedTouches = Array.from(event.changedTouches).map(toSimpleTouch)
  return {
    touches,
    changedTouches,
  }
}
