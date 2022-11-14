export const create = (icon) => {
  const $Icon = document.createElement('div')
  $Icon.className = 'MaskIcon'
  $Icon.style.maskImage = `url('${icon}')`
  $Icon.style.webkitMaskImage = `url('${icon}')`
  // @ts-ignore
  $Icon.role = 'none'
  return $Icon
}

export const setIcon = ($Icon, icon) => {
  $Icon.style.maskImage = `url('${icon}')`
  $Icon.style.webkitMaskImage = `url('${icon}')`
}
