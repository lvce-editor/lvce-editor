export const create$Button = (label, icon) => {
  const $Icon = document.createElement('div')
  $Icon.className = 'MaskIcon'
  $Icon.style.webkitMaskImage = `url('${icon}')`
  // @ts-ignore
  $Icon.role = 'none'

  const $Button = document.createElement('div')
  // @ts-ignore
  $Button.role = 'button'
  $Button.ariaLabel = label
  $Button.title = label
  $Button.tabIndex = 0
  $Button.className = `FindWidgetButton`
  $Button.append($Icon)
  return $Button
}
