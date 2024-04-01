const getTitleBarHeight = () => {
  if (
    // @ts-ignore
    navigator.windowControlsOverlay &&
    // @ts-ignore
    navigator.windowControlsOverlay.getTitlebarAreaRect
  ) {
    // @ts-ignore
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
