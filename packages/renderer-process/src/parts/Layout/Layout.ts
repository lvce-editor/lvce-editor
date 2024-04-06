const getTitleBarHeight = () => {
  if (
    // @ts-expect-error
    navigator.windowControlsOverlay?.getTitlebarAreaRect
  ) {
    // @ts-expect-error
    const titleBarRect = navigator.windowControlsOverlay.getTitlebarAreaRect()
    return titleBarRect.height
  }
  return 0
}

export const getBounds = () => {
  return {
    windowWidth: window.innerWidth,
    windowHeight: window.innerHeight,
    titleBarHeight: getTitleBarHeight(),
  }
}
