const isMacOsSaveShortcut = (input, platform) => {
  return platform === 'darwin' && input.type === 'keyDown' && input.meta && !input.control && !input.shift && input.key?.toLowerCase() === 's'
}

export const handleMacOsSaveShortcut = (event, input, webContents, platform = process.platform) => {
  if (!isMacOsSaveShortcut(input, platform)) {
    return
  }
  event.preventDefault()
  queueMicrotask(() => {
    webContents.sendInputEvent({
      keyCode: 'S',
      modifiers: ['control'],
      type: 'keyDown',
    })
    webContents.sendInputEvent({
      keyCode: 'S',
      modifiers: ['control'],
      type: 'keyUp',
    })
  })
}
