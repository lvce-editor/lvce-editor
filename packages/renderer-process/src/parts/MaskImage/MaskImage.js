export const setMaskImage = ($Element, icon) => {
  $Element.style.maskImage = `url('${icon}')`
  $Element.style.webkitMaskImage = `url('${icon}')`
}

export const transfer = ($From, $To) => {
  $To.style.maskImage = $From.style.maskImage
  $To.style.webkitMaskImage = $From.style.webkitMaskImage
  $From.style.maskImage = ''
  $From.style.webkitMaskImage = ''
}
