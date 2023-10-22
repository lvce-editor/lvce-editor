import * as AriaRoles from '../AriaRoles/AriaRoles.js'
import * as MaskImage from '../MaskImage/MaskImage.js'

export const create = (icon) => {
  const $Icon = document.createElement('div')
  $Icon.className = 'MaskIcon'
  if (!icon || icon.includes('/icons')) {
    MaskImage.setMaskImage($Icon, icon)
  } else {
    $Icon.classList.add(`MaskIcon${icon}`)
  }
  $Icon.role = AriaRoles.None
  return $Icon
}
