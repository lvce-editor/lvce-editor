export const setProp = ($Element, key, value) => {
  switch (key) {
    case 'maskImage':
      $Element.style.maskImage = `url('${value}')`
      $Element.style.webkitMaskImage = `url('${value}')`
      break
    case 'paddingLeft':
    case 'top':
    case 'width':
    case 'height':
    case 'left':
    case 'marginTop':
      if (typeof value === 'number') {
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
    default:
      $Element[key] = value
  }
}

export const setProps = ($Element, props) => {
  for (const key in props) {
    setProp($Element, key, props[key])
  }
}
