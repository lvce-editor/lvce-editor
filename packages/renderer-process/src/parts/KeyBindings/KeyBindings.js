import * as RendererWorker from '../RendererWorker/RendererWorker.js'

const handleKeyDown = (event) => {
  const isCtrlKey = event.ctrlKey
  const isShiftKey = event.shiftKey
  const isAltKey = event.altKey
  const key = event.key
  if (
    (isCtrlKey && key === 'I') ||
    key === 'Unidentified' ||
    key === 'ContextMenu'
  ) {
    // allow opening devtools
    return
  }
  RendererWorker.send(
    /* KeyBindings.handleKeyDown */ 'KeyBindings.handleKeyDown',
    /* isCtrlKey */ isCtrlKey,
    /* isShiftKey */ isShiftKey,
    /* isAltKey */ isAltKey,
    /* key */ key
  )

  event.preventDefault()
}

const handleKeyUp = (event) => {
  const isCtrlKey = event.ctrlKey
  const isShiftKey = event.shiftKey
  const isAltKey = event.altKey
  const key = event.key
  RendererWorker.send(
    /* KeyBindings.handleKeyUp */ 'KeyBindings.handleKeyUp',
    /* isCtrlKey */ isCtrlKey,
    /* isShiftKey */ isShiftKey,
    /* isAltKey */ isAltKey,
    /* key */ key
  )
}

export const hydrate = () => {
  // TODO could also use onkeydown and onkeyup global events which is a bit shorter
  window.addEventListener('keydown', handleKeyDown)
  // TODO only need keyup listener if keybindings include double modifier key (e.g "shift shift")
  // window.addEventListener('keyup', handleKeyUp)
}
