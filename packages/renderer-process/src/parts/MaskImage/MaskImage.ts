export const setMaskImage = ($Element, icon) => {
  if (!icon || icon.includes('/icons')) {
    $Element.style.maskImage = `url('${icon}')`
    $Element.style.webkitMaskImage = `url('${icon}')`
  } else {
    $Element.classList.add(`MaskIcon${icon}`)
  }
}
