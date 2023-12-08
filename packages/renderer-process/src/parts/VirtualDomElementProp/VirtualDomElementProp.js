export const setProp = ($Element, key, value) => {
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
    default:
      $Element[key] = value
  }
}
