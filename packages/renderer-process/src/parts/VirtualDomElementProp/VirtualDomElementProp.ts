/**
 *
 * @param {HTMLElement} $Element
 * @param string} key
 * @param {any} value
 * @param {any} eventMap
 */
export const setProp = ($Element, key, value, eventMap) => {
  switch (key) {
    case 'maskImage':
      $Element.style.maskImage = `url('${value}')`
      $Element.style.webkitMaskImage = `url('${value}')`
      break
    case 'paddingLeft':
    case 'paddingRight':
    case 'top':
    case 'left':
    case 'marginTop':
      if (typeof value === 'number') {
        $Element.style[key] = `${value}px`
      } else {
        $Element.style[key] = value
      }
      break
    case 'translate':
      $Element.style[key] = value
      break
    case 'width':
    case 'height':
      if ($Element instanceof HTMLImageElement) {
        $Element[key] = value
      } else if (typeof value === 'number') {
        $Element.style[key] = `${value}px`
      } else {
        $Element.style[key] = value
      }
      break
    case 'style':
      throw new Error('style property is not supported')
    case 'childCount':
    case 'type':
      break
    case 'ariaOwns': // TODO remove this once idl is supported
      if (value) {
        $Element.setAttribute('aria-owns', value)
      } else {
        $Element.removeAttribute('aria-owns')
      }
      break
    case 'inputType':
      // @ts-ignore
      $Element.type = value
      break
    case 'ariaLabelledBy':
      $Element.setAttribute('aria-labelledby', value)
      break
    case 'onBlur':
    case 'onClick':
    case 'onContextMenu':
    case 'onFocus':
    case 'onFocusIn':
    case 'onInput':
    case 'onKeyDown':
    case 'onPointerDown':
    case 'onWheel':
      const eventName = key.slice(2).toLowerCase()
      if (!eventMap) {
        return
      }
      const listener = eventMap[value]
      if (!listener) {
        console.warn('listener not found', value)
        return
      }

      $Element.addEventListener(eventName, listener)
      break
    default:
      if (key.startsWith('data-')) {
        $Element.dataset[key.slice('data-'.length)] = value
      } else {
        $Element[key] = value
      }
  }
}
