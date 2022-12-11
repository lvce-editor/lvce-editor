import * as MaskIcon from '../MaskIcon/MaskIcon.js'

export const create$Button = (label, icon) => {
  // TODO icon div might not be needed (unnecessary html element)
  const $Icon = MaskIcon.create(icon)

  const $Button = document.createElement('button')
  $Button.className = `IconButton`
  $Button.title = label
  $Button.ariaLabel = label
  $Button.append($Icon)
  return $Button
}
