// based on https://github.com/microsoft/vscode/blob/5f87632829dc3ac80203e2377727935184399431/src/vs/base/browser/ui/aria/aria.ts (License MIT)
import * as AriaRoles from '../AriaRoles/AriaRoles.js'

export const state = {
  $AriaAlert1: undefined,
  $AriaAlert2: undefined,
  $AriaMessages: undefined,
}

const create$AriaAlert = () => {
  const $AriaAlert = document.createElement('div')
  $AriaAlert.className = 'AriaAlert'
  // @ts-ignore
  $AriaAlert.role = AriaRoles.Alert
  $AriaAlert.ariaAtomic = 'true'
  return $AriaAlert
}

const setMessage = ($Old, $New, message) => {
  $Old.textContent = String(Math.random())
  $Old.ariaHidden = 'true'
  $New.removeAttribute('aria-hidden')
  $New.textContent = message
}

export const alert = (message) => {
  if (!message) {
    return
  }

  if (!state.$AriaMessages) {
    state.$AriaAlert1 = create$AriaAlert()
    state.$AriaAlert2 = create$AriaAlert()
    // TODO find better name, for example AriaMessages, AriaOutlet, AriaContainer, ScreenReaderMessages
    state.$AriaMessages = document.createElement('div')
    state.$AriaMessages.className = 'monaco-aria-container'
    state.$AriaMessages.append(state.$AriaAlert1, state.$AriaAlert2)
    document.body.append(state.$AriaMessages)
  }
  const $AriaAlert1 = state.$AriaAlert1
  const $AriaAlert2 = state.$AriaAlert2
  if ($AriaAlert1.textContent === message) {
    setMessage($AriaAlert1, $AriaAlert2, message)
  } else {
    setMessage($AriaAlert2, $AriaAlert1, message)
  }
}
