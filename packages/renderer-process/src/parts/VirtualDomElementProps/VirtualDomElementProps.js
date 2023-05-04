export const setProp = ($Element, key, value, events) => {
  switch (key) {
    case 'maskImage':
      $Element.style.maskImage = `url('${value}')`
      $Element.style.webkitMaskImage = `url('${value}')`
      break
    case 'paddingLeft':
    case 'top':
    case 'width':
    case 'height':
      $Element.style[key] = `${value}px`
      break
    case 'translateY':
      $Element.style.translate = `0 ${value}px`
      break
    case 'style':
      throw new Error('style property is not supported')
    case 'onwheelpassive':
      $Element.addEventListener('wheel', events[value], { passive: true })
      break
    case 'oncontextmenu':
    case 'onpointerdown':
    case 'ontouchstart':
    case 'ontouchmove':
    case 'ontouchend':
      const eventName = key.slice(2)
      $Element.addEventListener(eventName, events[value])
      break
    default:
      $Element[key] = value
  }
}

export const setProps = ($Element, props, events) => {
  for (const key in props) {
    setProp($Element, key, props[key], events)
  }
}
