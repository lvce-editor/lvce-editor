import * as MaskIcon from '../MaskIcon/MaskIcon.js'

export const create$Button = (label, icon) => {
  const $Icon = MaskIcon.create(icon)

  const $Button = document.createElement('button')
  $Button.className = `IconButton`
  $Button.title = label
  $Button.append($Icon)
  return $Button
}
