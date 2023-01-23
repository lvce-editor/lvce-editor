// based on https://github.com/microsoft/vscode/blob/5f87632829dc3ac80203e2377727935184399431/src/vs/base/browser/ui/aria/aria.ts (License MIT)
import * as AriaAlertState from '../AriaAlertState/AriaAlertState.js'
import * as AriaBoolean from '../AriaBoolean/AriaBoolean.js'
import * as AriaRoles from '../AriaRoles/AriaRoles.js'
import * as DomAttributeType from '../DomAttributeType/DomAttributeType.js'

const create$AriaAlert = () => {
  const $AriaAlert = document.createElement('div')
  $AriaAlert.className = 'AriaAlert'
  // @ts-ignore
  $AriaAlert.role = AriaRoles.Alert
  $AriaAlert.ariaAtomic = AriaBoolean.True
  return $AriaAlert
}

const setMessage = ($Old, $New, message) => {
  $Old.textContent = String(Math.random())
  $Old.ariaHidden = AriaBoolean.True
  $New.removeAttribute(DomAttributeType.AriaHidden)
  $New.textContent = message
}

export const alert = (message) => {
  if (!message) {
    return
  }

  if (!AriaAlertState.hasElements()) {
    const $AriaAlert1 = create$AriaAlert()
    const $AriaAlert2 = create$AriaAlert()
    // TODO find better name, for example AriaMessages, AriaOutlet, AriaContainer, ScreenReaderMessages
    const $AriaMessages = document.createElement('div')
    $AriaMessages.className = 'AriaContainer'
    $AriaMessages.append($AriaAlert1, $AriaAlert2)
    document.body.append($AriaMessages)
    AriaAlertState.setElements($AriaMessages, $AriaAlert1, $AriaAlert2)
  }
  const $AriaAlert1 = AriaAlertState.getAriaAlert1()
  const $AriaAlert2 = AriaAlertState.getAriaAlert2()
  if ($AriaAlert1.textContent === message) {
    setMessage($AriaAlert1, $AriaAlert2, message)
  } else {
    setMessage($AriaAlert2, $AriaAlert1, message)
  }
}
