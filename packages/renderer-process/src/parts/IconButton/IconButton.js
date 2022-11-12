export const create$Button = (label, icon) => {
  const $Icon = document.createElement('div')
  $Icon.className = 'MaskIcon'
  $Icon.style.webkitMaskImage = `url('${icon}')`
  // @ts-ignore
  $Icon.role = 'none'

  const $Button = document.createElement('button')
  $Button.className = `IconButton`
  $Button.title = label
  $Button.append($Icon)
  return $Button
}
