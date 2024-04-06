import * as VirtualDom from '../VirtualDom/VirtualDom.ts'

const queryInputs = ($Viewlet) => {
  return [...$Viewlet.querySelectorAll('input, textarea')]
}

export const rememberFocus = ($Viewlet, dom, eventMap) => {
  // TODO replace this workaround with
  // virtual dom diffing
  // @ts-expect-error
  const focused = document.activeElement.getAttribute('name')
  const $$Inputs = queryInputs($Viewlet)
  const inputMap = Object.create(null)
  for (const $Input of $$Inputs) {
    inputMap[$Input.name] = $Input.value
  }
  VirtualDom.renderInto($Viewlet, dom, eventMap)
  const $$NewInputs = queryInputs($Viewlet)
  for (const $Input of $$NewInputs) {
    $Input.value = inputMap[$Input.name] || $Input.value || ''
  }
  if (focused) {
    const $Focused = $Viewlet.querySelector(`[name="${focused}"]`)
    if ($Focused) {
      $Focused.focus()
    }
  }
}
