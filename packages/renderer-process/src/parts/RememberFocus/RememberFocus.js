import * as VirtualDom from '../VirtualDom/VirtualDom.js'

const queryInputs = ($Viewlet) => {
  return [...$Viewlet.querySelectorAll('input, textarea')]
}

export const rememberFocus = ($Viewlet, dom, eventMap) => {
  // TODO replace this workaround with
  // virtual dom diffing
  let focused = document.activeElement.getAttribute('name')
  const $$Inputs = queryInputs($Viewlet)
  const inputMap = Object.create(null)
  for (const $Input of $$Inputs) {
    inputMap[$Input.name] = $Input.value
  }
  VirtualDom.renderInto($Viewlet, dom, eventMap)
  const $$NewInputs = queryInputs($Viewlet)
  for (const $Input of $$NewInputs) {
    $Input.value = inputMap[$Input.name] || ''
  }
  if (focused) {
    const $Focused = $Viewlet.querySelector(`[name="${focused}"]`)
    if ($Focused) {
      $Focused.focus()
    }
  }
}
