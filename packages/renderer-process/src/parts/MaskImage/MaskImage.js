export const setMaskImage = ($Element, icon) => {
  if (!icon || icon.includes('/icons')) {
    $Element.style.maskImage = `url('${icon}')`
    $Element.style.webkitMaskImage = `url('${icon}')`
  } else {
    $Element.classList.add(`MaskIcon${icon}`)
  }
}
export const unsetMaskImage = ($Element, icon) => {
  if (!icon || icon.includes('/icons')) {
    return
  }
  $Element.classList.remove(`MaskIcon${icon}`)
}

export const transfer = ($From, $To) => {
  $To.style.maskImage = $From.style.maskImage
  $To.style.webkitMaskImage = $From.style.webkitMaskImage
  $From.style.maskImage = ''
  $From.style.webkitMaskImage = ''
}
