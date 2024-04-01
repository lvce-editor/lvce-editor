import * as AriaRoles from '../AriaRoles/AriaRoles.ts'
import * as MaskImage from '../MaskImage/MaskImage.js'

export const create = (icon) => {
  const $Icon = document.createElement('div')
  $Icon.className = 'MaskIcon'
  MaskImage.setMaskImage($Icon, icon)
  $Icon.role = AriaRoles.None
  return $Icon
}
