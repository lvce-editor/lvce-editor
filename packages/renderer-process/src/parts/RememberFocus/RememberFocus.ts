import * as ComponentUid from '../ComponentUid/ComponentUid.ts'
import * as VirtualDom from '../VirtualDom/VirtualDom.ts'

const queryInputs = ($Viewlet) => {
  return [...$Viewlet.querySelectorAll('input, textarea')]
}

export const rememberFocus = ($Viewlet, dom, eventMap, uid = 0) => {
  // TODO replace this workaround with
  // virtual dom diffing
  const oldLeft = $Viewlet.style.left
  const oldTop = $Viewlet.style.top
  const oldWidth = $Viewlet.style.width
  const oldHeight = $Viewlet.style.height
  // @ts-expect-error
  const focused = document.activeElement.getAttribute('name')
  const $$Inputs = queryInputs($Viewlet)
  const inputMap = Object.create(null)
  for (const $Input of $$Inputs) {
    inputMap[$Input.name] = $Input.value
  }
  if (uid) {
    const $New = VirtualDom.render(dom, eventMap).firstChild
    ComponentUid.set($New, uid)
    $Viewlet.replaceWith($New)
    $Viewlet = $New
  } else {
    VirtualDom.renderInto($Viewlet, dom, eventMap)
  }
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

  $Viewlet.style.top = oldTop
  $Viewlet.style.left = oldLeft
  $Viewlet.style.height = oldHeight
  $Viewlet.style.width = oldWidth

  return $Viewlet
}
